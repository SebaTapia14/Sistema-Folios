// routes/auth.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Direction = require('../models/Direction');
const Department = require('../models/Department'); // Importación correcta del modelo Department
const RefreshToken = require('../models/RefreshToken');
const { authMiddleware } = require('../middlewares/authMiddleware'); // Middleware de autenticación

const PasswordResetToken = require('../models/PasswordResetToken'); // Nuevo modelo

// Función para generar Access Token
const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15h' }
    );
};

// Función para generar Refresh Token
const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    await RefreshToken.create({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    return refreshToken;
};

// Ruta para inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Nombre de usuario y contraseña requeridos' });
    }

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

        const accessToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

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

// Nueva ruta para obtener la información de dirección y departamentos del usuario
router.get('/user-info', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            include: [
                {
                    model: Direction,
                    as: 'direction',
                    attributes: ['id', 'name', 'code'],
                    include: [
                        {
                            model: Department,
                            as: 'departments',
                            attributes: ['id', 'name', 'code']
                        }
                    ]
                }
            ]
        });

        if (!user || !user.direction) {
            console.error("Dirección no encontrada o no tiene acceso.");
            return res.status(404).json({ message: "Dirección no encontrada o no tiene acceso." });
        }

        res.json({
            direction: {
                id: user.direction.id,
                name: user.direction.name,
                code: user.direction.code
            },
            departments: user.direction.departments || []
        });
    } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
        res.status(500).json({ message: "Error al obtener la información del usuario" });
    }
});

// Ruta para cerrar sesión (logout)
router.post('/logout', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ message: 'Token no proporcionado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await RefreshToken.destroy({ where: { userId: decoded.userId } });

        res.json({ message: 'Cierre de sesión exitoso' });
    } catch (error) {
        console.error('Error en /logout:', error);
        res.status(500).json({ message: 'Error al cerrar sesión', error: error.message });
    }
});


// Solicitar restablecimiento de contraseña
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { username: email } });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600000); // Expira en 1 hora

        await PasswordResetToken.create({
            userId: user.id,
            token,
            expiresAt: expiry,
        });

        const resetLink = `${process.env.RESET_PASSWORD_URL}?token=${token}`;
        await sendPasswordResetEmail(email, resetLink);

        res.status(200).json({ message: 'Correo de restablecimiento enviado.' });
    } catch (error) {
        console.error('Error en /forgot-password:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
});

// Restablecer contraseña
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const resetToken = await PasswordResetToken.findOne({ where: { token } });
        if (!resetToken || resetToken.expiresAt < new Date()) {
            return res.status(400).json({ message: 'El enlace ha expirado o es inválido.' });
        }

        const user = await User.findByPk(resetToken.userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

        user.password = newPassword; // Aquí deberías usar bcrypt para hashear la contraseña
        await user.save();

        await resetToken.destroy(); // Borra el token usado
        res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
        console.error('Error en /reset-password:', error);
        res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
});

module.exports = router;
