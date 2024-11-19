// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Direction = require('./Direction');

const User = sequelize.define('User', {
    username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: {
            notEmpty: { msg: 'El nombre de usuario no puede estar vacío' }
        }
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            notEmpty: { msg: 'La contraseña no puede estar vacía' }
        }
    },
    role: { 
        type: DataTypes.ENUM('admin', 'oficina de partes municipal', 'oficina de partes direccion'), 
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El rol es obligatorio' }
        }
    },
    directionId: { 
        type: DataTypes.INTEGER, 
        allowNull: true, 
        references: { 
            model: Direction, 
            key: 'id' 
        },
        comment: 'Solo aplicable para usuarios de oficina de partes direccion'
    }
}, {
    tableName: 'users',
    timestamps: true
});

// Asociaciones
User.belongsTo(Direction, { as: 'direction', foreignKey: 'directionId' });

module.exports = User;
