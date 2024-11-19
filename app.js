// app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize } = require('./models'); // Importa sequelize desde models/index.js

// Importar Rutas y Middleware
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const auditRoutes = require('./routes/audit');
const adminRoutes = require('./routes/admin');
const directionRoutes = require('./routes/directions');
const departmentRoutes = require('./routes/departments');
const documentTypeRoutes = require('./routes/documentTypes');
const folioRoutes = require('./routes/folios');
const municipalFoliosRoutes = require('./routes/municipalFolios');
const directionalFoliosRoutes = require('./routes/directionalFolios');
const utilityRoutes = require('./routes/utilityRoutes'); // Nueva ruta para direcciones y tipos de documentos

// Configuración de CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGIN : '*',
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Ruta básica de prueba para el servidor
app.get('/', (req, res) => res.send('¡Servidor de Sistema de Folios funcionando!'));

// Conectar y sincronizar la base de datos
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conectado a la base de datos MySQL');
        
        // Sincronizar solo en desarrollo o en caso de configuración inicial de base de datos
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Tablas sincronizadas en desarrollo con alteraciones.');
        } else {
            await sequelize.sync(); // Sin alteraciones en producción
            console.log('Tablas sincronizadas en producción sin alteraciones.');
        }
    } catch (error) {
        console.error('Error al conectar o sincronizar la base de datos:', error);
    }
})();

// Configuración de Rutas
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/directions', directionRoutes);
app.use('/departments', departmentRoutes);
app.use('/documenttypes', documentTypeRoutes);
app.use('/folios', folioRoutes);
app.use('/municipal', municipalFoliosRoutes);
app.use('/directional', directionalFoliosRoutes);
app.use('/audit', auditRoutes);
app.use('/api/util', utilityRoutes); // Nueva ruta para obtener direcciones y tipos de documentos

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada. Verifique la URL o consulte la documentación.' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(process.env.NODE_ENV === 'production' ? 500 : 500).json({
        message: process.env.NODE_ENV === 'production' 
            ? 'Ha ocurrido un error en el servidor. Intente de nuevo más tarde.' 
            : `Error en el servidor: ${err.message}`,
        ...(process.env.NODE_ENV === 'development' ? { error: err } : {})
    });
});

// Iniciar el servidor en el puerto especificado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
