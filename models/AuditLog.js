// models/AuditLog.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Modelo de usuario para asociación
const Folio = require('./Folio'); // Modelo de folio para asociación

const AuditLog = sequelize.define('AuditLog', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    folioId: {
        type: DataTypes.INTEGER,
        allowNull: true // Asegúrate de que sea NULLABLE
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'auditlogs',
    timestamps: false
});


// Asociaciones
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
AuditLog.belongsTo(Folio, { foreignKey: 'folioId', as: 'folio' });

module.exports = AuditLog;
