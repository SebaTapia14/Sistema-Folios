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

// Definimos la relación
RefreshToken.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = RefreshToken;
