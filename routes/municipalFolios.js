// routes/municipalFolios.js

const sequelize = require('../config/database'); // Ajusta el path si es necesario
const express = require('express');
const router = express.Router();
const Folio = require('../models/Folio'); // Modelo de folios
const User = require('../models/User'); // Modelo de usuarios
const Direction = require('../models/Direction'); // Modelo de direcciones
const Department = require('../models/Department'); // Modelo de departamentos
const DocumentType = require('../models/DocumentType'); // Modelo de tipos de documentos
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');

// Función para generar número de folio municipal
async function generateMunicipalFolioNumber(directionId, typeId) {
    const year = new Date().getFullYear();
    const transaction = await sequelize.transaction(); // Usa el sequelize importado

    try {
        const direction = await Direction.findByPk(directionId, { attributes: ['code'] });
        const documentType = await DocumentType.findByPk(typeId, { attributes: ['code'] });

        if (!direction || !documentType) {
            throw new Error('La dirección o el tipo de documento no existen.');
        }

        const lastFolio = await Folio.findOne({
            where: { directionId, typeId, year },
            order: [['correlativo', 'DESC']],
            transaction // Asegúrate de pasar la transacción
        });

        const correlativo = lastFolio ? lastFolio.correlativo + 1 : 1;
        const folioNumber = `${direction.code}-${documentType.code}/${correlativo}`;

        await transaction.commit();
        return { correlativo, folioNumber, year };
    } catch (error) {
        await transaction.rollback();
        console.error('Error en generateMunicipalFolioNumber:', error);
        throw new Error('Error al generar el número correlativo');
    }
}

// Ruta para crear un nuevo folio para la Oficina de Parte Municipal
router.post('/create', authMiddleware, checkRole(['oficina de partes municipal', 'admin']), async (req, res) => {
    const { directionId, typeId, topic, description, observations } = req.body;
    const userId = req.userId;

    if (!directionId || !typeId || !topic) {
        return res.status(400).json({ message: 'Faltan datos requeridos.' });
    }

    try {
        const { correlativo, folioNumber, year } = await generateMunicipalFolioNumber(directionId, typeId);

        const folio = await Folio.create({
            directionId,
            typeId,
            correlativo,
            folioNumber,
            year,
            topic,
            description,
            observations,
            userId,
            scope: 'externo'
        });

        res.status(201).json({ message: 'Folio creado exitosamente', folio });
    } catch (error) {
        console.error('Error al crear folio:', error); // <-- Agrega este log
        res.status(500).json({ message: 'Error al crear folio.', error: error.message });
    }
});


// Obtener folios municipales
router.get('/', async (req, res) => {

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { rows: folios, count } = await Folio.findAndCountAll({
            where: {
                departmentId: null // Solo folios municipales
            },
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [
                {
                    model: Direction,
                    as: 'folioDirection',
                    attributes: ['name', 'code']
                },
                {
                    model: DocumentType,
                    as: 'folioDocumentType',
                    attributes: ['name', 'code']
                }
            ]
        });

        const totalPages = Math.ceil(count / limit);
        res.json({ success: true, folios, totalPages });
    } catch (error) {
        console.error('Error al obtener folios municipales:', error);
        res.status(500).json({ message: 'Error al obtener folios municipales', error: error.message });
    }
});


// Obtener detalles de un folio específico
router.get('/:id', authMiddleware, checkRole(['oficina de partes municipal', 'admin']), async (req, res) => {
    const { id } = req.params;
    try {
        const folio = await FolioModel.findByPk(id, {
            include: [
                {
                    model: Direction,
                    as: 'folioDirection', 
                    attributes: ['name', 'code']
                },
                {
                    model: DocumentType,
                    as: 'folioDocumentType',
                    attributes: ['name', 'code']
                }
            ]
        });
        
        if (!folio) {
            return res.status(404).json({ message: 'Folio no encontrado' });
        }

        const formattedFolio = {
            ...folio.toJSON(),
            folioNumber: `${folio.folioDirection?.code || 'N/A'}-${folio.folioDocumentType?.code || 'N/A'}/${folio.correlativo}`,
            directionName: folio.folioDirection?.name || 'N/A',
            documentTypeName: folio.folioDocumentType?.name || 'N/A'
        };

        res.json({ success: true, folio: formattedFolio });
    } catch (error) {
        console.error('Error al obtener detalles del folio:', error);
        res.status(500).json({ message: 'Error al obtener detalles del folio', error: error.message });
    }
});

module.exports = router;
