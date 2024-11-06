// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'funcionaria','funcionario', 'secretaria'), allowNull: false },
    directionId: { type: DataTypes.INTEGER, allowNull: true } // Para funcionarias y secretarias
});

module.exports = User;