const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');

// Crear un departamento (solo para administradores)
router.post('/create', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { name, directionId } = req.body;

    try {
        const department = await Department.create({ name, directionId });
        res.status(201).json({ message: 'Departamento creado', department });
    } catch (error) {
        console.error('Error al crear departamento:', error);
        res.status(400).json({ message: 'Error al crear departamento', error: error.message });
    }
});

// Listar todos los departamentos con paginación opcional (solo para administradores)
router.get('/', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { rows: departments, count } = await Department.findAndCountAll({
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['name', 'ASC']], // Ordenar alfabéticamente por nombre
        });

        res.json({
            success: true,
            departments,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error al obtener departamentos:', error);
        res.status(500).json({ message: 'Error al obtener departamentos', error: error.message });
    }
});

module.exports = router;
