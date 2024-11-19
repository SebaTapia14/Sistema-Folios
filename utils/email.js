// email.js
require('dotenv').config();
const nodemailer = require('nodemailer');

// Crear transporte para SSL
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Por ejemplo: smtp.office365.com
    port: 465, // Puerto estándar para SSL
    secure: true, // Habilitar SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Probar conexión y enviar correo
(async () => {
    try {
        // Probar conexión al servidor
        await transporter.verify();
        console.log('Conexión exitosa con SSL');

        // Opciones del correo
        const mailOptions = {
            from: process.env.EMAIL_FROM, // EMAIL_FROM definido en el .env
            to: 'destinatario@ejemplo.com', // Cambia por un correo válido para pruebas
            subject: 'Prueba de correo con SSL',
            text: 'Este es un correo de prueba utilizando SSL.',
        };

        // Enviar el correo
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.messageId);
    } catch (error) {
        console.error('Error al enviar el correo:', error.message);
    }
})();
