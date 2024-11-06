const express = require('express');
const router = express.Router();
const DocumentType = require('../models/DocumentType');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware'); // Desestructuramos ambas funciones

// Crear un tipo de documento (solo para administradores)
router.post('/create', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { name } = req.body;

    try {
        const documentType = await DocumentType.create({ name });
        res.status(201).json({ message: 'Tipo de documento creado', documentType });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear tipo de documento', error });
    }
});

// Listar todos los tipos de documentos (solo para administradores)
router.get('/', authMiddleware, checkRole(['admin']), async (req, res) => {
    try {
        const documentTypes = await DocumentType.findAll();
        res.json(documentTypes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tipos de documentos', error });
    }
});

module.exports = router;
