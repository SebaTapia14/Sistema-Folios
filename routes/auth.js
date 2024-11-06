const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

// Función para generar el token de acceso con duración corta
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Duración del token de acceso: 15 minutos
    );
};

// Función para generar el token de actualización con duración larga y guardarlo en la base de datos
const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' } // Duración del token de actualización: 7 días
    );

    // Guardar el token de actualización en la base de datos
    await RefreshToken.create({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expira en 7 días
    });

    return refreshToken;
};

// Ruta para registrar nuevos usuarios (solo para administradores)
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const user = await User.create({
            username,
            password: hashedPassword,
            role
        });
        res.status(201).json({ message: 'Usuario creado con éxito', user });
    } catch (error) {
        console.error('Error en /register:', error);
        res.status(400).json({ message: 'Error al crear usuario', error: error.message });
    }
});

// Ruta para iniciar sesión y generar ambos tokens
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar el usuario por nombre de usuario
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

        // Generar tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        // Enviar los tokens al cliente
        res.json({
            message: 'Inicio de sesión exitoso',
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Error en /login:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

// Ruta para renovar el token de acceso usando el token de actualización
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    // Verificar si el token de actualización se proporcionó en la solicitud
    if (!refreshToken) {
        return res.status(403).json({ message: 'Token de actualización no proporcionado' });
    }

    try {
        // Verificar el token de actualización
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Buscar el token de actualización en la base de datos para asegurarse de que sea válido
        const storedToken = await RefreshToken.findOne({
            where: { token: refreshToken, userId: decoded.userId }
        });

        if (!storedToken) {
            return res.status(403).json({ message: 'Token de actualización inválido o expirado' });
        }

        // Generar un nuevo token de acceso
        const user = await User.findByPk(decoded.userId);
        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Error en /refresh:', error);
        res.status(403).json({ message: 'Token de actualización inválido o expirado' });
    }
});

// Ruta para cerrar sesión e invalidar el token de actualización
router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;

    // Verificar si el token de actualización se proporcionó en la solicitud
    if (!refreshToken) {
        return res.status(403).json({ message: 'Token de actualización no proporcionado' });
    }

    try {
        // Eliminar el token de actualización de la base de datos
        const deletedToken = await RefreshToken.destroy({ where: { token: refreshToken } });

        if (deletedToken) {
            res.json({ message: 'Sesión cerrada exitosamente' });
        } else {
            res.status(404).json({ message: 'Token de actualización no encontrado' });
        }
    } catch (error) {
        console.error('Error en /logout:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});

module.exports = router;
