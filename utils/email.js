const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com", // Servidor SMTP de Outlook/Office365
    port: 587, // Puerto para TLS
    secure: false, // TLS requiere secure=false
    auth: {
        user: process.env.EMAIL_USER, // Tu correo del dominio
        pass: process.env.EMAIL_PASS, // Contraseña o App Password
    },
});

async function sendPasswordResetEmail(email, link) {
    try {
        await transporter.sendMail({
            from: `"Sistema Folios" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Restablecimiento de contraseña',
            html: `
                <p>Hola,</p>
                <p>Hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el siguiente enlace:</p>
                <a href="${link}" target="_blank">Restablecer Contraseña</a>
                <p>Si no solicitaste este cambio, ignora este mensaje.</p>
                <p>Gracias,<br>El equipo de Sistema Folios</p>
            `,
        });
        console.log(`Correo enviado a: ${email}`);
    } catch (error) {
        console.error(`Error al enviar correo: ${error.message}`);
        throw new Error('No se pudo enviar el correo.');
    }
}

module.exports = { sendPasswordResetEmail };
