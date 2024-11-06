require('dotenv').config(); // Carga las variables de entorno
const express = require('express');
const app = express();
const sequelize = require('./config/database'); // Configuración de la base de datos

// Importaciones de Modelos
const User = require('./models/User');
const Direction = require('./models/Direction');
const Department = require('./models/Department');
const DocumentType = require('./models/DocumentType');
const Folio = require('./models/Folio');
const RefreshToken = require('./models/RefreshToken');
const AuditLog = require('./models/AuditLog'); // Importa el modelo de auditoría

// Importaciones de Rutas y Middleware
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const directionRoutes = require('./routes/directions');
const departmentRoutes = require('./routes/departments');
const documentTypeRoutes = require('./routes/documentTypes');
const folioRoutes = require('./routes/folios');
const auditRoutes = require('./routes/audit'); // Importa las rutas de auditoría
const { authMiddleware } = require('./middlewares/authMiddleware'); // Middleware de autenticación

app.use(express.json()); // Middleware para manejar JSON en solicitudes

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor de Sistema de Folios funcionando!');
});

// Probar la conexión a la base de datos y sincronizar los modelos
sequelize.authenticate()
    .then(() => {
        console.log('Conectado a la base de datos MySQL');
        
        // Sincronizar todos los modelos, incluyendo AuditLog
        sequelize.sync({ force: true }) // Cambia a `force: false` en producción
            .then(() => {
                console.log("Tablas sincronizadas en MySQL");
            })
            .catch(err => console.log("Error al sincronizar tablas:", err));
    })
    .catch(err => {
        console.error('Error de conexión a la base de datos:', err);
    });

// Rutas de autenticación (registro, inicio de sesión, etc.)
app.use('/auth', authRoutes);

// Rutas de gestión de usuarios, direcciones, departamentos, tipos de documentos y folios
app.use('/users', userRoutes);
app.use('/directions', directionRoutes);
app.use('/departments', departmentRoutes);
app.use('/document-types', documentTypeRoutes);
app.use('/folios', folioRoutes);

// Ruta de auditoría para consultar el historial de acciones
app.use('/audit', auditRoutes); // Agrega las rutas de auditoría

// Ejemplo de una ruta protegida para verificar autenticación
app.get('/protected', authMiddleware, (req, res) => {
    res.send('Esta es una ruta protegida.');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
