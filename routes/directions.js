const express = require('express');
const router = express.Router();
const Direction = require('../models/Direction');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware'); // Desestructuramos ambas funciones

// Crear una dirección (solo para administradores)
router.post('/create', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { name, code } = req.body;
    
    try {
        const direction = await Direction.create({ name, code });
        res.status(201).json({ message: 'Dirección creada', direction });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear dirección', error });
    }
});

// Listar todas las direcciones (solo para administradores)
router.get('/', authMiddleware, checkRole(['admin']), async (req, res) => {
    try {
        const directions = await Direction.findAll();
        res.json(directions);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener direcciones', error });
    }
});

module.exports = router;
