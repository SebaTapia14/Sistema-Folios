// routes/users.js

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const Direction = require('../models/Direction');
const Department = require('../models/Department'); // Importamos el modelo de Department
const RefreshToken = require('../models/RefreshToken');
const AuditLog = require('../models/AuditLog');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');

// Roles válidos permitidos para asignar a usuarios
const validRoles = ['admin', 'oficina de partes municipal', 'oficina de partes direccion'];

// Función para registrar acciones de auditoría
async function logAuditAction(userId, action) {
    try {
        await AuditLog.create({ userId, action });
    } catch (error) {
        console.error("Error al registrar auditoría:", error);
    }
}

// Crear un usuario (solo para administradores)
router.post('/', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { username, password, role, directionId } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe.' });
        }

        // Validar el rol
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Rol no válido.' });
        }

        // Verificar que la dirección exista si se proporciona
        if (directionId) {
            const directionExists = await Direction.findByPk(directionId);
            if (!directionExists) {
                return res.status(400).json({ success: false, message: 'Dirección no válida.' });
            }
        }

        // Hash de contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, role, directionId });

        // Registro de auditoría
        await logAuditAction(req.userId, `Creó el usuario ${username}`);

        res.status(201).json({ success: true, message: 'Usuario creado exitosamente', user });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ success: false, message: 'Error al crear usuario', error: error.message });
    }
});

// Listar usuarios con paginación y filtro por rol (solo para administradores)
router.get('/', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { page = 1, limit = 3, role } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    try {
        const whereClause = role ? { role } : {}; // Filtra por rol si se proporciona

        const { rows: users, count } = await User.findAndCountAll({
            where: whereClause,
            attributes: ['id', 'username', 'role', 'createdAt'],
            include: [
                {
                    model: Direction,
                    as: 'direction',
                    attributes: ['name', 'code'], // Incluimos nombre y código de la dirección
                    include: [
                        {
                            model: Department,
                            as: 'departments', // Asociar departamentos si la dirección tiene
                            attributes: ['id', 'name', 'code']
                        }
                    ]
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ success: false, message: 'Error al obtener usuarios', error: error.message });
    }
});

// Editar un usuario (solo para administradores)
router.put('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { id } = req.params;
    const { username, password, role, directionId } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Validar el rol si se proporciona
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: 'Rol no válido.' });
        }

        // Verificar si el nuevo nombre de usuario ya está en uso
        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ where: { username } });
            if (usernameExists) {
                return res.status(400).json({ success: false, message: 'El nombre de usuario ya está en uso.' });
            }
            user.username = username;
        }

        user.role = role || user.role;

        // Verificar que la dirección exista si se proporciona
        if (directionId) {
            const directionExists = await Direction.findByPk(directionId);
            if (!directionExists) {
                return res.status(400).json({ success: false, message: 'Dirección no válida.' });
            }
            user.directionId = directionId; // Actualizar la dirección si se proporciona
        }

        // Actualizar contraseña si se proporciona
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        // Registro de auditoría
        await logAuditAction(req.userId, `Actualizó el usuario ${user.username}`);

        res.json({ success: true, message: 'Usuario actualizado exitosamente', user });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar usuario', error: error.message });
    }
});

// Eliminar un usuario (solo para administradores)
router.delete('/:id', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Eliminar tokens de actualización antes de eliminar el usuario
        await RefreshToken.destroy({ where: { userId: id } });
        await user.destroy();

        // Registro de auditoría
        await logAuditAction(req.userId, `Eliminó el usuario ${user.username}`);

        res.json({ success: true, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar usuario', error: error.message });
    }
});

module.exports = router;
