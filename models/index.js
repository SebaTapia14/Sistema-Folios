// models/index.js

const sequelize = require('../config/database');
const User = require('./User');
const Direction = require('./Direction');
const Department = require('./Department');
const DocumentType = require('./DocumentType');
const Folio = require('./Folio');
const AuditLog = require('./AuditLog');

// Asociaciones

// Dirección y Departamento
Direction.hasMany(Department, { as: 'departments', foreignKey: 'directionId' });
Department.belongsTo(Direction, { as: 'direction', foreignKey: 'directionId' });

// Folio y Dirección
Direction.hasMany(Folio, { foreignKey: 'directionId', as: 'folioDirection' });
Folio.belongsTo(Direction, { foreignKey: 'directionId', as: 'direction' }); // Alias 'direction' para simplificar

// Folio y Departamento
Department.hasMany(Folio, { foreignKey: 'departmentId', as: 'folioDepartment' });
Folio.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' }); // Alias 'department'

// Folio y Tipo de Documento
DocumentType.hasMany(Folio, { foreignKey: 'typeId', as: 'folioDocumentType' });
Folio.belongsTo(DocumentType, { foreignKey: 'typeId', as: 'documentType' }); // Alias 'documentType'

// Usuario y Folio
User.hasMany(Folio, { foreignKey: 'userId', as: 'foliosByUser' });
Folio.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// AuditLog Asociaciones
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'auditUser' });

module.exports = {
    sequelize,
    User,
    Direction,
    Department,
    DocumentType,
    Folio,
    AuditLog
};
