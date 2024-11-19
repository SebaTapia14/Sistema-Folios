// models/DocumentType.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definir el modelo DocumentType
const DocumentType = sequelize.define('DocumentType', {
    name: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true, // Opcional, si el nombre debe ser único
        validate: {
            notEmpty: { msg: 'El nombre del tipo de documento es requerido' }
        }
    },
    code: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true, // Esto asegura que 'code' sea único
        validate: {
            notEmpty: { msg: 'El código del tipo de documento es requerido' }
        }
    }
}, {
    tableName: 'documenttypes', 
    timestamps: false, // Desactiva si no necesitas `createdAt` y `updatedAt`
});

module.exports = DocumentType;
