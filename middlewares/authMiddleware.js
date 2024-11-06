const jwt = require('jsonwebtoken');

// Middleware de autenticación: verifica el token y obtiene el rol del usuario
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Verifica si el header Authorization está presente
    if (!authHeader) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    // Extrae el token eliminando la palabra "Bearer " del inicio
    const token = authHeader.split(' ')[1]; 
    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    // Verifica el token usando JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        
        // Almacena el userId y role del token en el request
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    });
};

// Middleware para verificar el rol del usuario
const checkRole = (roles) => (req, res, next) => {
    // Verifica si el rol del usuario está en la lista de roles permitidos
    if (!roles.includes(req.userRole)) {
        return res.status(403).json({ message: 'Acceso denegado: rol no autorizado' });
    }
    next();
};

module.exports = { authMiddleware, checkRole };
