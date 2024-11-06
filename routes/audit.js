const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware'); // Desestructuramos ambas funciones

// Ruta para consultar el historial de auditoría (solo para administradores)
router.get('/', authMiddleware, checkRole(['admin']), async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        console.error('Error al obtener el historial de auditoría:', error);
        res.status(500).json({ message: 'Error al obtener el historial de auditoría', error: error.message });
    }
});

module.exports = router;
