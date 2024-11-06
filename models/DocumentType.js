// models/DocumentType.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DocumentType = sequelize.define('DocumentType', {
    name: { type: DataTypes.STRING, allowNull: false },
});

module.exports = DocumentType;
