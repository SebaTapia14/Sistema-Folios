const express = require('express');
const router = express.Router();
const DocumentType = require('../models/DocumentType');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');

// Crear un tipo de documento
router.post(
    '/create',
    authMiddleware,
    checkRole(['admin', 'oficina de partes municipal', 'oficina de partes direccion']),
    async (req, res) => {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({ message: 'El nombre y el código son requeridos' });
        }

        try {
            const documentType = await DocumentType.create({ name, code });
            console.log('Tipo de documento creado:', documentType);
            res.status(201).json({ message: 'Tipo de documento creado', documentType });
        } catch (error) {
            console.error('Error al crear tipo de documento:', error);
            res.status(400).json({ message: 'Error al crear tipo de documento', error: error.message });
        }
    }
);

// Listar todos los tipos de documentos
router.get(
    '/',
    authMiddleware,
    checkRole(['admin', 'oficina de partes municipal', 'oficina de partes direccion']),
    async (req, res) => {
        try {
            console.log('Usuario autenticado:', req.user);
            const documentTypes = await DocumentType.findAll({
                attributes: ['id', 'name', 'code']
            });
            res.json({ success: true, documentTypes });
        } catch (error) {
            console.error('Error al obtener tipos de documentos:', error);
            res.status(500).json({ message: 'Error al obtener tipos de documentos', error: error.message });
        }
    }
);

module.exports = router;
