const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Direction = require('./Direction');
const Department = require('./Department');
const DocumentType = require('./DocumentType');

const Folio = sequelize.define('Folio', {
    directionId: { 
        type: DataTypes.INTEGER, 
        references: { model: Direction, key: 'id' }
    },
    departmentId: { 
        type: DataTypes.INTEGER, 
        references: { model: Department, key: 'id' },
        allowNull: true // Solo aplicable para internos
    },
    typeId: { 
        type: DataTypes.INTEGER, 
        references: { model: DocumentType, key: 'id' },
        allowNull: true // Permitido solo en documentos internos
    },
    scope: { 
        type: DataTypes.ENUM('interno', 'externo'), 
        allowNull: false 
    },
    correlativo: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    folioNumber: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    year: { 
        type: DataTypes.INTEGER, // Añadimos el campo year para almacenar el año
        allowNull: false 
    },
    topic: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT 
    },
    dateCreated: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
});

module.exports = Folio;
