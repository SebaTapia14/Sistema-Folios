// templates/js/app.js

// Variables para la URL base del backend y token de autenticación
const API_URL = 'http://localhost:3000';
let accessToken = localStorage.getItem('accessToken');

// Referencias a elementos del DOM
const folioTableBody = document.getElementById('folioTableBody');
const folioForm = document.getElementById('folioForm');
const logoutButton = document.getElementById('logoutButton');

// Función para verificar si el usuario está autenticado
const checkAuthentication = () => {
    if (!accessToken) {
        window.location.href = 'index.html'; // Redirigir al login si no hay token
    }
};

// Cargar folios en la tabla
const loadFolios = async () => {
    try {
        const response = await fetch(`${API_URL}/folios`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const folios = await response.json();

        // Limpiar tabla antes de agregar nuevas filas
        folioTableBody.innerHTML = '';

        folios.forEach(folio => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${folio.folioNumber}</td>
                <td>${folio.directionId}</td>
                <td>${folio.departmentId}</td>
                <td>${folio.typeId}</td>
                <td>${folio.topic}</td>
                <td>${new Date(folio.createdAt).toLocaleDateString()}</td>
                <td><button onclick="editFolio(${folio.id})">Editar</button></td>
            `;
            folioTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar folios:', error);
    }
};

// Crear un nuevo folio
folioForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newFolio = {
        directionId: document.getElementById('direction').value,
        departmentId: document.getElementById('department').value,
        typeId: document.getElementById('type').value,
        topic: document.getElementById('topic').value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch(`${API_URL}/folios/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(newFolio)
        });
        const data = await response.json();

        if (response.ok) {
            alert('Folio creado exitosamente');
            loadFolios(); // Recargar lista de folios
            folioForm.reset(); // Limpiar formulario
        } else {
            alert('Error al crear folio: ' + data.message);
        }
    } catch (error) {
        console.error('Error al crear folio:', error);
    }
});

// Cerrar sesión
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('accessToken'); // Eliminar token del almacenamiento local
    window.location.href = 'index.html'; // Redirigir al login
});

// Inicializar el dashboard
checkAuthentication();
loadFolios();
