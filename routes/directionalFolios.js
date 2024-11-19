// routes/directionalFolios.js

const express = require('express');
const router = express.Router();
const FolioModel = require('../models/Folio');
const Direction = require('../models/Direction');
const Department = require('../models/Department');
const DocumentType = require('../models/DocumentType');
const User = require('../models/User'); 
const { authMiddleware, checkRole } = require('../middlewares/authMiddleware');
const sequelize = require('../config/database');

// Función para generar el número de folio en el formato correcto con abreviaciones
async function generateDirectionalFolioNumber(directionId, departmentId, typeId) {
    console.log("Datos recibidos en generateDirectionalFolioNumber:", { directionId, departmentId, typeId });

    // Convertir typeId a número y verificar
    typeId = parseInt(typeId, 10);  // Asegura que el typeId es un número
    console.log("typeId convertido a número:", typeId);

    const year = new Date().getFullYear();
    const transaction = await sequelize.transaction();

    try {
        // Intentar obtener la dirección y tipo de documento usando findByPk
        const direction = await Direction.findByPk(directionId);
        
        // Intentar obtener DocumentType usando una consulta directa para confirmar la existencia
        const [documentType] = await sequelize.query(
            `SELECT * FROM documenttypes WHERE id = :typeId`,
            { 
                replacements: { typeId },
                type: sequelize.QueryTypes.SELECT 
            }
        );

        // Verificar que existan los registros
        if (!direction) {
            console.error("Dirección no encontrada:", directionId);
            throw new Error("Dirección no encontrada.");
        }
        if (!documentType) {
            console.error("Tipo de documento no encontrado:", typeId);
            throw new Error("Tipo de documento no encontrado.");
        }

        // Registrar los datos encontrados para verificar
        console.log("Registros encontrados:");
        console.log("Dirección:", direction);
        console.log("Tipo de documento:", documentType);

        let department = null;
        if (departmentId) {
            department = await Department.findByPk(departmentId);
            if (!department) {
                console.error("Departamento no encontrado:", departmentId);
                throw new Error("Departamento no válido o no encontrado.");
            }
        }

        // Configurar el whereClause para la consulta
        const whereClause = { directionId, typeId, year };
        if (department) whereClause.departmentId = departmentId;

        const lastFolio = await FolioModel.findOne({
            where: whereClause,
            order: [['correlativo', 'DESC']],
            transaction
        });

        // Generar el nuevo correlativo
        const correlativo = lastFolio ? lastFolio.correlativo + 1 : 1;
        const folioNumber = department 
            ? `${direction.code}-${department.code}-${documentType.code}/${correlativo}`
            : `${direction.code}-${documentType.code}/${correlativo}`;

        await transaction.commit();
        return { correlativo, folioNumber, year };
    } catch (error) {
        await transaction.rollback();
        console.error('Error en generateDirectionalFolioNumber:', error);
        throw new Error('Error al generar el número correlativo');
    }
}


// Ruta para crear un nuevo folio para Oficina de Parte de Dirección
router.post('/create', authMiddleware, checkRole(['oficina de partes direccion', 'admin']), async (req, res) => {
    const { directionId, departmentId, typeId, topic, description, observations } = req.body;
    const userId = req.userId;

    if (!directionId || !typeId || !topic) {
        return res.status(400).json({ message: 'Por favor, complete todos los campos requeridos.' });
    }

    try {
        const { correlativo, folioNumber, year } = await generateDirectionalFolioNumber(directionId, departmentId, typeId);

        const folio = await FolioModel.create({
            directionId,
            departmentId: departmentId || null, // Asigna null si no hay departamento
            typeId,
            scope: 'interno',
            correlativo,
            folioNumber,
            year,
            topic,
            description,
            observations,
            userId
        });

        res.status(201).json({ message: 'Folio creado exitosamente', folio });
    } catch (error) {
        console.error('Error al crear folio de dirección:', error);

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ message: 'Error en clave foránea: Verifique los IDs de dirección, departamento y tipo de documento.' });
        } else if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ message: 'Datos no válidos', errors: error.errors });
        } else {
            res.status(500).json({ message: 'Error al crear folio de dirección', error: error.message });
        }
    }
});

// Ruta para obtener todos los folios creados por la Oficina de Parte de Dirección
router.get('/', authMiddleware, checkRole(['oficina de partes direccion', 'admin']), async (req, res) => {
    const { page = 1, limit = 20 } = req.query; // Página actual y límite de registros por página

    try {
        // Obtener el usuario autenticado con su directionId
        const user = await User.findByPk(req.userId, {
            attributes: ['directionId']
        });

        if (!user || !user.directionId) {
            return res.status(403).json({ message: 'Acceso denegado: Dirección no asignada al usuario' });
        }

        // Configurar la paginación
        const offset = (page - 1) * limit;

        // Consultar los folios con paginación
        const { rows: folios, count } = await FolioModel.findAndCountAll({
            where: { 
                scope: 'interno',
                directionId: user.directionId // Filtra por la dirección del usuario
            },
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [
                {
                    model: Direction,
                    as: 'folioDirection',
                    attributes: ['name', 'code']
                },
                {
                    model: Department,
                    as: 'folioDepartment',
                    attributes: ['name', 'code']
                },
                {
                    model: DocumentType,
                    as: 'folioDocumentType',
                    attributes: ['name', 'code']
                }
            ]
        });

        // Calcular el número total de páginas
        const totalPages = Math.ceil(count / limit);

        // Formatear los datos de folios para enviar al frontend
        const formattedFolios = folios.map(folio => {
            const directionCode = folio.folioDirection ? folio.folioDirection.code : 'N/A';
            const departmentCode = folio.folioDepartment ? folio.folioDepartment.code : 'N/A';
            const documentTypeCode = folio.folioDocumentType ? folio.folioDocumentType.code : 'N/A';

            const folioNumber = 
                directionCode !== 'N/A' && documentTypeCode !== 'N/A'
                    ? departmentCode !== 'N/A'
                        ? `${directionCode}-${departmentCode}-${documentTypeCode}/${folio.correlativo}`
                        : `${directionCode}-${documentTypeCode}/${folio.correlativo}`
                    : 'N/A';

            return {
                ...folio.toJSON(),
                folioNumber,
                directionName: folio.folioDirection ? folio.folioDirection.name : 'N/A',
                departmentName: folio.folioDepartment ? folio.folioDepartment.name : 'N/A',
                documentTypeName: folio.folioDocumentType ? folio.folioDocumentType.name : 'N/A'
            };
        });

        // Enviar la respuesta con la información de paginación
        res.json({
            success: true,
            folios: formattedFolios,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error al obtener folios:', error);
        res.status(500).json({ message: 'Error al obtener folios', error: error.message });
    }
});


module.exports = router;
