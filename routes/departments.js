const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware'); // Desestructuramos ambas funciones

// Crear un departamento (solo para administradores)
router.post('/create', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { name, directionId } = req.body;

    try {
        const department = await Department.create({ name, directionId });
        res.status(201).json({ message: 'Departamento creado', department });
    } catch (error) {
        res.status(400).json({ message: 'Error al crear departamento', error });
    }
});

// Listar todos los departamentos (solo para administradores)
router.get('/', authMiddleware, checkRole(['admin']), async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener departamentos', error });
    }
});

module.exports = router;
