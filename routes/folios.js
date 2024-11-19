// routes/folios.js

const express = require('express');
const router = express.Router();
const FolioModel = require('../models/Folio');
const User = require('../models/User');
const DocumentType = require('../models/DocumentType');
const Direction = require('../models/Direction');
const Department = require('../models/Department');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { logAudit } = require('../utils/auditLogger'); // Importar logAudit
const { Op } = require('sequelize');

// Ruta para listar todos los folios con paginación (accesible para roles especificados)
router.get('/', authMiddleware, checkRole(['admin', 'oficina de partes municipal', 'oficina de partes direccion']), async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { rows: folios, count } = await FolioModel.findAndCountAll({
            include: [
                { model: User, as: 'folioUser', attributes: ['username'] },
                { model: DocumentType, as: 'folioDocumentType', attributes: ['name'] },
                { model: Direction, as: 'folioDirection', attributes: ['name'] },
                { model: Department, as: 'folioDepartment', attributes: ['name'] }
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            folios,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error al obtener folios:', error);
        res.status(500).json({ message: 'Error al obtener folios', error: error.message });
    }
});

// Ruta para buscar y filtrar folios con paginación y búsqueda (por número de folio, usuario o tipo de documento)
router.get('/search', authMiddleware, checkRole(['admin', 'oficina de partes municipal', 'oficina de partes direccion']), async (req, res) => {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        // Buscar folios con sus relaciones
        const { rows: folios, count } = await FolioModel.findAndCountAll({
            where: {
                [Op.or]: [
                    { folioNumber: { [Op.like]: `%${search}%` } }, // Filtrar por número de folio
                ]
            },
            include: [
                {
                    model: User,
                    as: 'folioUser', // Relación con el modelo User
                    attributes: ['username'], // Obtener solo el nombre de usuario
                    required: false, // No forzar que todos los folios tengan un usuario
                },
                {
                    model: DocumentType,
                    as: 'folioDocumentType', // Relación con el modelo DocumentType
                    attributes: ['name'], // Obtener solo el nombre del tipo de documento
                    required: false,
                },
                {
                    model: Direction,
                    as: 'folioDirection', // Relación con el modelo Direction
                    attributes: ['name'], // Obtener el nombre de la dirección
                    required: false,
                },
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']], // Ordenar por fecha de creación descendente
        });

        // Respuesta con los datos y la paginación
        res.json({
            success: true,
            folios,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error al buscar folios:', error);
        res.status(500).json({ success: false, message: 'Error al buscar folios' });
    }
});


// Ruta para filtrar folios según criterios específicos (dirección, departamento, tipo de documento, rango de fechas)
router.get('/filter', authMiddleware, checkRole(['admin', 'oficina de partes municipal', 'oficina de partes direccion']), async (req, res) => {
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
        const filteredFolios = await FolioModel.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'folioUser', attributes: ['username'] },
                { model: DocumentType, as: 'folioDocumentType', attributes: ['name'] },
                { model: Direction, as: 'folioDirection', attributes: ['name'] },
                { model: Department, as: 'folioDepartment', attributes: ['name'] }
            ]
        });
        res.json({ success: true, folios: filteredFolios });
    } catch (error) {
        console.error('Error al filtrar folios:', error);
        res.status(500).json({ message: 'Error al filtrar folios', error });
    }
});

// Ruta para obtener detalles de un folio específico
router.get('/:id', authMiddleware, checkRole(['admin', 'oficina de partes municipal', 'oficina de partes direccion']), async (req, res) => {
    const { id } = req.params;
    try {
        const folio = await FolioModel.findByPk(id, {
            include: [
                { model: User, as: 'folioUser', attributes: ['username'] },
                { model: DocumentType, as: 'folioDocumentType', attributes: ['name'] },
                { model: Direction, as: 'folioDirection', attributes: ['name'] },
                { model: Department, as: 'folioDepartment', attributes: ['name'] }
            ],
        });
        if (!folio) {
            return res.status(404).json({ message: 'Folio no encontrado' });
        }

        // Registrar en auditoría
        await logAudit(req.userId, 'Acceso a Folio', `Accedió a los detalles del folio ${folio.folioNumber}`, folio.id);

        res.json({ success: true, folio });
    } catch (error) {
        console.error('Error al obtener detalles del folio:', error);
        res.status(500).json({ message: 'Error al obtener detalles del folio', error });
    }
});

// Ruta para eliminar un folio específico
router.delete('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
        const folio = await FolioModel.findByPk(id); // Asegúrate de usar el nombre correcto del modelo
        if (!folio) {
            return res.status(404).json({ success: false, message: 'Folio no encontrado' });
        }

        await folio.destroy();
        res.json({ success: true, message: 'Folio eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el folio:', error); // Esto imprime más información del error
        res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
    }
});


// Actualizar un folio específico
router.put('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { id } = req.params;
    const { directionId, departmentId, topic, description } = req.body;

    try {
        const folio = await Folio.findByPk(id);
        if (!folio) {
            return res.status(404).json({ success: false, message: 'Folio no encontrado' });
        }

        // Actualizar los campos
        folio.directionId = directionId;
        folio.departmentId = departmentId;
        folio.topic = topic;
        folio.description = description;

        await folio.save();
        res.json({ success: true, message: 'Folio actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el folio:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


module.exports = router;
