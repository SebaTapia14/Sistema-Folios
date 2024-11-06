const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false, // Ejemplo: 'create', 'update'
    },
    folioId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Puede ser nulo si la acción no afecta un folio específico
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true, // Almacena información adicional sobre la acción
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = AuditLog;
