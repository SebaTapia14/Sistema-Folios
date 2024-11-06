// models/Department.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Direction = require('./Direction');

const Department = sequelize.define('Department', {
    name: { type: DataTypes.STRING, allowNull: false },
    directionId: { 
        type: DataTypes.INTEGER, 
        references: { model: Direction, key: 'id' },
        allowNull: false 
    }
});

module.exports = Department;
