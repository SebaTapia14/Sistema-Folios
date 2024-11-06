// models/Direction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Direction = sequelize.define('Direction', {
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true }
});

module.exports = Direction;
