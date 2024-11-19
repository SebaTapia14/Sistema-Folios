// routes/admin.js

const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const auditRoutes = require('./audit');
const Folio = require('../models/Folio');
const User = require('../models/User');
const DocumentType = require('../models/DocumentType');
const Direction = require('../models/Direction');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const { logAudit } = require('../utils/auditLogger');
const { Op } = require('sequelize');

// Middleware de autenticación y rol de administrador para todas las rutas en /admin
router.use(authMiddleware, checkRole(['admin']));

// Montar rutas de administración
router.use('/users', userRoutes);
router.use('/audit', auditRoutes);

// Ruta para obtener usuarios con sus direcciones
router.get('/users', async (req, res) => {
    const { page = 1, limit = 3 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { rows: users, count } = await User.findAndCountAll({
            include: [{ model: Direction, as: 'direction', attributes: ['name'] }],
            offset: parseInt(offset),
            limit: parseInt(limit),
        });

        res.json({
            success: true,
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
});


// Ruta para búsqueda de folios con filtrado por número de folio, usuario, tipo de documento y dirección
router.get('/folios/search', async (req, res) => {
    const { query = '', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        // Paso 1: Contar el total de registros sin cargar asociaciones
        const totalFolios = await Folio.count({
            where: {
                [Op.or]: [
                    { folioNumber: { [Op.like]: `%${query}%` } }
                ]
            }
        });

        // Paso 2: Obtener los registros con las asociaciones y paginación
        const folios = await Folio.findAll({
            where: {
                [Op.or]: [
                    { folioNumber: { [Op.like]: `%${query}%` } }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'folioUser', // Asegúrate de usar el alias correcto definido en el modelo Folio
                    attributes: ['username'],
                    where: query ? { username: { [Op.like]: `%${query}%` } } : undefined,
                    required: false
                },
                {
                    model: DocumentType,
                    as: 'folioDocumentType',
                    attributes: ['name'],
                    where: query ? { name: { [Op.like]: `%${query}%` } } : undefined,
                    required: false
                },
                {
                    model: Direction,
                    as: 'folioDirection',
                    attributes: ['name', 'code'],
                    where: query ? { name: { [Op.like]: `%${query}%` } } : undefined,
                    required: false
                }
            ],
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            folios,
            totalPages: Math.ceil(totalFolios / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error al buscar folios:', error);
        res.status(500).json({ success: false, message: 'Error al buscar folios' });
    }
});


// Ruta para crear un nuevo usuario
router.post('/users', async (req, res) => {
    const { username, password, role, directionId } = req.body;

    try {
        const newUser = await User.create({ username, password, role, directionId });
        
        await logAudit(req.userId, 'Creación de Usuario', `Creó el usuario ${username} con rol ${role}`);

        res.json({ success: true, message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ success: false, message: 'Error al crear usuario' });
    }
});

// Ruta para eliminar un usuario
router.delete('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { id } = req.params;
    try {
        const folio = await FolioModel.findByPk(id); // Cambia 'Folio' por 'FolioModel'
        if (!folio) {
            return res.status(404).json({ success: false, message: 'Folio no encontrado' });
        }

        await folio.destroy();
        res.json({ success: true, message: 'Folio eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el folio:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Ruta para búsqueda de usuarios
router.get('/users/search', async (req, res) => {
    const { query } = req.query; // Captura el término de búsqueda

    try {
        const users = await User.findAll({
            where: {
                username: { [Op.like]: `%${query}%` }
            },
            include: [
                { model: Direction, as: 'direction', attributes: ['name'] }
            ]
        });

        res.json({ success: true, users });
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ success: false, message: 'Error al buscar usuarios' });
    }
});


module.exports = router;
