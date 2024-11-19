// models/Direction.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Evita importar Department y User directamente aquí para que las asociaciones
// se configuren adecuadamente en `index.js`
const Direction = sequelize.define('Direction', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El nombre de la dirección no puede estar vacío' }
        }
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: 'El código de la dirección no puede estar vacío' }
        }
    }
}, {
    tableName: 'directions', // Nombre explícito de la tabla
    timestamps: false // Deshabilitar timestamps si no se requieren
});

module.exports = Direction;
