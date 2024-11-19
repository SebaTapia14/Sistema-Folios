const bcrypt = require('bcryptjs');

const password = 'Seba.14.tapia'; // Cambia esto por tu contraseña

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log("Contraseña hasheada:", hash);
});
