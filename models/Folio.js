const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Direction = require('./Direction');
const Department = require('./Department');
const DocumentType = require('./DocumentType');
const User = require('./User');

const Folio = sequelize.define('Folio', {
    directionId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: Direction, key: 'id' }
    },
    departmentId: { 
        type: DataTypes.INTEGER,
        allowNull: true, // El departamento es opcional para usuarios de "Oficina de Partes Municipal"
        references: { model: Department, key: 'id' }
    },
    typeId: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: { model: DocumentType, key: 'id' }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: User, key: 'id' }
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
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    topic: { 
        type: DataTypes.STRING, 
        allowNull: false
    },
    description: { 
        type: DataTypes.TEXT,
        allowNull: true
    },
    observations: { 
        type: DataTypes.TEXT,
        allowNull: true
    },
    dateCreated: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'folios', 
    timestamps: true
});

// Asociaciones con nombres de alias únicos
Folio.belongsTo(Direction, { foreignKey: 'directionId', as: 'folioDirection' });
Folio.belongsTo(Department, { foreignKey: 'departmentId', as: 'folioDepartment' });
Folio.belongsTo(DocumentType, { foreignKey: 'typeId', as: 'folioDocumentType' });
Folio.belongsTo(User, { foreignKey: 'userId', as: 'folioUser' });

module.exports = Folio;
