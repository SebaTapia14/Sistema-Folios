const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PasswordResetToken = sequelize.define('PasswordResetToken', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'password_reset_tokens',
    timestamps: false,
});

module.exports = PasswordResetToken;
