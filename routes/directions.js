// routes/directions.js

const express = require('express');
const router = express.Router();
const Direction = require('../models/Direction');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');

// Crear una dirección (solo para administradores)
router.post('/create', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { name, code } = req.body;

    try {
        const direction = await Direction.create({ name, code });
        res.status(201).json({ message: 'Dirección creada exitosamente', direction });
    } catch (error) {
        console.error('Error al crear dirección:', error);
        res.status(400).json({ message: 'Error al crear dirección', error });
    }
});

// Listar todas las direcciones (permitido para administradores y oficina de partes municipal)
router.get('/', authMiddleware, checkRole(['admin', 'oficina de partes municipal']), async (req, res) => {
    try {
        const directions = await Direction.findAll();
        res.json({ success: true, directions });
    } catch (error) {
        console.error('Error al obtener direcciones:', error);
        res.status(500).json({ message: 'Error al obtener direcciones', error });
    }
});

module.exports = router;
