// routes/utilityRoutes.js

const express = require('express');
const router = express.Router();
const Direction = require('../models/Direction');
const DocumentType = require('../models/DocumentType');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');

// Ruta para obtener todas las direcciones
router.get('/directions', authMiddleware, checkRole(['oficina de partes municipal', 'admin']), async (req, res) => {
    try {
        const directions = await Direction.findAll({ attributes: ['id', 'name', 'code'] });
        res.json({ success: true, directions });
    } catch (error) {
        console.error('Error al obtener direcciones:', error);
        res.status(500).json({ success: false, message: 'Error al obtener direcciones' });
    }
});

// Ruta para obtener todos los tipos de documentos
router.get('/documentTypes', authMiddleware, checkRole(['oficina de partes municipal', 'admin']), async (req, res) => {
    try {
        const documentTypes = await DocumentType.findAll({ attributes: ['id', 'name', 'code'] });
        res.json({ success: true, documentTypes });
    } catch (error) {
        console.error('Error al obtener tipos de documentos:', error);
        res.status(500).json({ success: false, message: 'Error al obtener tipos de documentos' });
    }
});

module.exports = router;
