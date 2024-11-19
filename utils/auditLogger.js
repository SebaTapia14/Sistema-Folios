// utils/auditLogger.js

const AuditLog = require('../models/AuditLog');

// Acciones permitidas para la auditoría
const allowedActions = [
    'Creación de Usuario',
    'Eliminación de Usuario',
    'Creación de Folio',
    'Actualización de Folio',
    'Eliminación de Folio'
];

// Función para registrar acciones en el log de auditoría evitando duplicados consecutivos
async function logAudit(userId, action, details = null, folioId = null) {
    if (!allowedActions.includes(action)) return;

    const lastLog = await AuditLog.findOne({
        where: { userId },
        order: [['createdAt', 'DESC']],
    });

    if (lastLog && lastLog.action === action && lastLog.details === details) return;

    await AuditLog.create({
        userId,
        action,
        details,
        folioId,
    });
}

module.exports = { logAudit };
