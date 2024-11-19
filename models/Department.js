// models/Department.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El nombre del departamento no puede estar vacío' }
        }
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: 'El código del departamento no puede estar vacío' }
        }
    },
    directionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: 'El ID de dirección es requerido' }
        }
    }
}, {
    tableName: 'departments', // Nombre explícito de la tabla en la base de datos
    timestamps: false          // Desactiva createdAt y updatedAt
});

module.exports = Department;
