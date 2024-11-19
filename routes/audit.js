// routes/audit.js

const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');

// Acciones permitidas en el log de auditoría
const ALLOWED_ACTIONS = new Set([
    'Creación de Usuario',
    'Eliminación de Usuario',
    'Creación de Folio',
    'Actualización de Folio',
    'Eliminación de Folio'
]);

// Función para registrar acciones en el log de auditoría evitando duplicados consecutivos
async function logAudit(userId, action, details = null, folioId = null) {
    if (!ALLOWED_ACTIONS.has(action)) return;

    try {
        if (folioId) {
            const folioExists = await Folio.findByPk(folioId);
            if (!folioExists) {
                console.warn(`El folioId ${folioId} no existe, registrando con folioId NULL`);
                folioId = null; // Registrar como NULL si no existe
            }
        }

        const lastLog = await AuditLog.findOne({
            where: { userId, action },
            order: [['createdAt', 'DESC']],
        });

        if (!lastLog || lastLog.details !== details || lastLog.folioId !== folioId) {
            await AuditLog.create({ userId, action, details, folioId });
        }
    } catch (error) {
        console.error('Error al registrar en el log de auditoría:', error);
        throw new Error('Error en el registro de auditoría');
    }
}


// Ruta POST para registrar en el log de auditoría desde el frontend
router.post('/', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { action, details, folioId } = req.body;
    const userId = req.userId; // Se obtiene del token decodificado en authMiddleware

    if (!ALLOWED_ACTIONS.has(action)) {
        return res.status(400).json({ success: false, message: 'Acción no permitida en el log de auditoría' });
    }

    try {
        await logAudit(userId, action, details, folioId);
        res.json({ success: true, message: 'Registro de auditoría creado exitosamente' });
    } catch (error) {
        console.error("Error al crear el registro de auditoría:", error);
        res.status(500).json({ success: false, message: 'Error al crear el registro de auditoría' });
    }
});

// Ruta para obtener el registro de auditoría con filtros y paginación (solo para administradores)
router.get('/', authMiddleware, checkRole(['admin']), async (req, res) => {
    const { page = 1, limit = 10, username, action } = req.query;
    const offset = (page - 1) * parseInt(limit, 10);

    try {
        const whereClause = {};

        if (username) {
            const user = await User.findOne({ where: { username } });
            if (user) whereClause.userId = user.id;
            else return res.json({ success: true, logs: [], totalPages: 0, currentPage: page });
        }

        if (action) whereClause.action = action;

        const { rows: logs, count } = await AuditLog.findAndCountAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit, 10),
            offset,
            include: [{ model: User, as: 'auditUser', attributes: ['username'] }]
        });

        const formattedLogs = logs.map(log => ({
            id: log.id,
            action: log.action,
            createdAt: log.createdAt,
            username: log.auditUser ? log.auditUser.username : 'Usuario no encontrado'
        }));

        res.json({
            success: true,
            logs: formattedLogs,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Error al obtener el registro de auditoría:", error);
        res.status(500).json({ success: false, message: 'Error al obtener el registro de auditoría' });
    }
});

module.exports = router;