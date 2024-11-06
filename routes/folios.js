const express = require('express');
const router = express.Router();
const Folio = require('../models/Folio');
const AuditLog = require('../models/AuditLog');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware'); // Desestructuramos ambas funciones
const { Op } = require('sequelize');
const sequelize = require('../config/database'); // Configuración de la base de datos para transacciones

// Función para generar el número correlativo
async function generateCorrelativeNumber({ directionId, departmentId, typeId, scope }) {
    const year = new Date().getFullYear();

    console.log("Iniciando transacción para generar número correlativo...");
    const transaction = await sequelize.transaction();

    try {
        // Buscar el último folio para la combinación especificada en el año actual
        const lastFolio = await Folio.findOne({
            where: { directionId, departmentId, typeId, scope, year },
            order: [['correlativo', 'DESC']],
            transaction
        });

        console.log("Último folio encontrado:", lastFolio);

        // Calcular el correlativo
        const correlativo = lastFolio ? lastFolio.correlativo + 1 : 1;
        const folioNumber = `${directionId}/${year}-${correlativo}`;

        await transaction.commit();
        console.log("Número correlativo generado:", folioNumber);

        return { correlativo, folioNumber, year };
    } catch (error) {
        await transaction.rollback();
        console.error('Error en generateCorrelativeNumber:', error);
        throw new Error('Error al generar el número correlativo');
    }
}

// Crear un nuevo folio (solo para funcionarias y secretarias)
router.post('/create', authMiddleware, checkRole(['admin', 'funcionaria', 'secretaria']), async (req, res) => {
    const { directionId, departmentId, typeId, scope, topic, description } = req.body;
    const userId = req.userId;
    const role = req.userRole;

    try {
        const { correlativo, folioNumber, year } = await generateCorrelativeNumber({
            directionId,
            departmentId,
            typeId,
            scope
        });

        const folio = await Folio.create({
            directionId,
            departmentId,
            typeId,
            scope,
            roleAssigned: role,
            correlativo,
            folioNumber,
            year,
            topic,
            description
        });

        await AuditLog.create({
            userId,
            action: 'create',
            folioId: folio.id,
            details: `Folio creado con el número ${folioNumber}`
        });

        res.status(201).json({ message: 'Folio creado', folio });
    } catch (error) {
        console.error('Error al crear folio:', error);
        res.status(500).json({ message: 'Error al crear folio', error: error.message });
    }
});

// Listar todos los folios (solo para administradores)
router.get('/', authMiddleware, checkRole(['admin']), async (req, res) => {
    try {
        const folios = await Folio.findAll();
        res.json(folios);
    } catch (error) {
        console.error('Error al obtener folios:', error);
        res.status(500).json({ message: 'Error al obtener folios', error });
    }
});

// Filtrar folios por criterios específicos (solo para administradores)
router.get('/filter', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { directionId, departmentId, typeId, startDate, endDate } = req.query;

    const whereClause = {};
    if (directionId) whereClause.directionId = directionId;
    if (departmentId) whereClause.departmentId = departmentId;
    if (typeId) whereClause.typeId = typeId;
    if (startDate && endDate) {
        whereClause.createdAt = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
        };
    }

    try {
        const filteredFolios = await Folio.findAll({ where: whereClause });
        res.json(filteredFolios);
    } catch (error) {
        console.error('Error al filtrar folios:', error);
        res.status(500).json({ message: 'Error al filtrar folios', error });
    }
});

// Actualizar un folio (solo para administradores)
router.put('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { id } = req.params;
    const { directionId, departmentId, typeId, scope, topic, description } = req.body;
    const userId = req.userId;

    try {
        const folio = await Folio.findByPk(id);
        if (!folio) {
            return res.status(404).json({ message: 'Folio no encontrado' });
        }

        await folio.update({
            directionId,
            departmentId,
            typeId,
            scope,
            topic,
            description
        });

        await AuditLog.create({
            userId,
            action: 'update',
            folioId: folio.id,
            details: `Folio actualizado con nuevos datos`
        });

        res.json({ message: 'Folio actualizado', folio });
    } catch (error) {
        console.error('Error al actualizar folio:', error);
        res.status(500).json({ message: 'Error al actualizar folio', error: error.message });
    }
});

// Eliminar un folio (solo para administradores)
router.delete('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const folio = await Folio.findByPk(id);
        if (!folio) {
            return res.status(404).json({ message: 'Folio no encontrado' });
        }

        await folio.destroy();
        res.json({ message: 'Folio eliminado' });

        await AuditLog.create({
            userId: req.userId,
            action: 'delete',
            folioId: id,
            details: `Folio eliminado con ID ${id}`
        });
    } catch (error) {
        console.error('Error al eliminar folio:', error);
        res.status(500).json({ message: 'Error al eliminar folio', error: error.message });
    }
});

module.exports = router;
