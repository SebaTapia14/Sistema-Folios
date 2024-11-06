const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Relación con el modelo User

const RefreshToken = sequelize.define('RefreshToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

module.exports = RefreshToken;
