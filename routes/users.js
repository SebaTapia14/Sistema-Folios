const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware'); // Desestructura ambas funciones

// Crear un usuario (solo para administradores)
router.post('/create', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = await User.create({ username, password, role });
        res.status(201).json({ message: 'Usuario creado', user });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear usuario', error });
    }
});

// Listar usuarios (solo para administradores)
router.get('/', authMiddleware, checkRole(['admin']), async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
});

module.exports = router;
