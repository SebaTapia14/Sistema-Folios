const API_BASE_URL = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', () => {
    loadUsers(1);
    setupLogoutButton();

    if (document.getElementById("folioTableBody")) {
        loadFolios(1);
    }
    if (document.getElementById("auditLogTableBody")) {
        loadAuditLog(1); // Llama a loadAuditLog solo si existe el contenedor
    }

    loadRoleOptions();
    loadDirectionOptions();

    const roleSelector = document.getElementById("role");
    if (roleSelector) roleSelector.addEventListener("change", toggleDirectionField);

    // Ejecuta toggleDirectionField al cargar la página para verificar el rol inicial
    toggleDirectionField();
});

let currentUserId = null;

// Manejo de solicitudes con token de autorización
async function fetchWithAuth(endpoint, options = {}) {
    const API_BASE_URL = "http://localhost:3000"; // Asegúrate de que esta variable esté definida
    let accessToken = localStorage.getItem('accessToken');

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
        }
    });

    // Si el token expira, intenta renovarlo
    if (response.status === 401) {
        accessToken = await refreshToken();
        if (accessToken) {
            response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${accessToken}`
                }
            });
        } else {
            handleUnauthorized();
            return Promise.reject(new Error("No autorizado. Redirigido al inicio de sesión."));
        }
    }

    return response;
}

// Renueva el token de acceso
async function refreshToken() {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            handleUnauthorized();
            return null;
        }

        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            return data.accessToken;
        } else {
            handleUnauthorized();
            return null;
        }
    } catch (error) {
        console.error("Error al refrescar el token:", error);
        handleUnauthorized();
        return null;
    }
}

// Maneja el caso de no estar autorizado
function handleUnauthorized() {
    alert("Sesión expirada. Por favor, inicie sesión nuevamente.");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login.html';
}


// Cerrar sesión
function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = 'index.html';
}

// Configurar botón de cerrar sesión
function setupLogoutButton() {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
}

// Mostrar/ocultar campo de dirección según el rol seleccionado
function toggleDirectionField() {
    const role = document.getElementById("role").value; // Captura el valor sin alterarlo
    const directionField = document.getElementById("directionField");

    console.log("ToggleDirectionField activado.");
    console.log("Rol actual seleccionado:", role);

    if (role === "oficina de partes direccion") {
        console.log("Mostrando el campo de dirección.");
        directionField.style.display = "block";
    } else {
        console.log("Ocultando el campo de dirección.");
        directionField.style.display = "none";
    }
}


// Cargar opciones de roles dinámicamente
async function loadRoleOptions() {
    const roleSelector = document.getElementById("role");
    if (roleSelector) {
        roleSelector.innerHTML = ''; // Limpiar opciones previas

        const roles = [
            { value: "admin", text: "Administrador" },
            { value: "oficina de partes municipal", text: "Oficina de Partes Municipal" },
            { value: "oficina de partes direccion", text: "Oficina de Partes Dirección" }
        ];

        roles.forEach(({ value, text }) => {
            const option = document.createElement("option");
            option.value = value;
            option.text = text;
            roleSelector.add(option);
        });
    }
}


// Cargar opciones de dirección dinámicamente
async function loadDirectionOptions() {
    const directionSelector = document.getElementById("direction");
    if (directionSelector) {
        try {
            const response = await fetchWithAuth('/directions');
            const data = await response.json();
            if (response.ok && data.success) {
                directionSelector.innerHTML = '<option value="" disabled selected>Seleccione una dirección</option>'; // limpiar y resetear

                data.directions.forEach(direction => {
                    const option = document.createElement("option");
                    option.value = direction.id; // Aquí usamos el id numérico
                    option.text = direction.name;
                    directionSelector.add(option);
                });
            }
        } catch (error) {
            console.error("Error al cargar direcciones:", error);
        }
    }
}


// Función para manejar errores
function handleError(message) {
    alert("Error: " + message);
}


// Solo registra en auditoría las acciones importantes
async function logAudit(action, details = null) {
    // Lista de acciones permitidas para registrar
    const actionsToLog = [
        'Creación de Usuario',
        'Eliminación de Usuario',
        'Creación de Folio',
        'Actualización de Folio',
        'Eliminación de Folio'
    ];

    // Si la acción no está en la lista de acciones permitidas, no la registra
    if (!actionsToLog.includes(action)) {
        return; // No registrar acciones innecesarias
    }

    try {
        await fetchWithAuth('/audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, details })
        });
    } catch (error) {
        console.error("Error al registrar en la auditoría:", error);
    }
}


// Implementación mínima de loadAuditLog
async function loadAuditLog(page = 1) {
    console.log("loadAuditLog activado"); // Depuración
    try {
        const response = await fetchWithAuth(`/audit?page=${page}&limit=10`);
        const data = await response.json();

        if (response.ok && data.success) {
            renderAuditLogs(data.logs);
            setupPagination(data.totalPages, page, loadAuditLog, "auditPaginationControls");
        } else {
            handleError(data.message || "Respuesta inesperada");
        }
    } catch (error) {
        handleError(error.message);
    }
}


// Renderizar registros de auditoría
function renderAuditLogs(logs) {
    const auditLogTableBody = document.getElementById("auditLogTableBody");
    if (!auditLogTableBody) {
        console.error("Elemento auditLogTableBody no encontrado");
        return;
    }

    auditLogTableBody.innerHTML = '';
    logs.forEach(log => {
        auditLogTableBody.innerHTML += `
            <tr>
                <td>${log.username || "N/A"}</td>
                <td>${log.action || "N/A"}</td>
                <td>${new Date(log.createdAt).toLocaleDateString()}</td>
            </tr>
        `;
    });
}


// Cargar usuarios con paginación
async function loadUsers(page = 1) {
    try {
        const response = await fetchWithAuth(`/admin/users?page=${page}&limit=3`);
        const data = await response.json();

        if (response.ok && data.success) {
            renderUsers(data.users);
            setupPagination(data.totalPages, page, loadUsers, "userPaginationControls");
        } else {
            handleError(data.message || "Respuesta inesperada");
        }
    } catch (error) {
        handleError(error.message);
    }
}


// Renderizar lista de usuarios
function renderUsers(users) {
    const userList = document.getElementById("userTableBody");
    if (!userList) {
        console.error("Elemento userTableBody no encontrado");
        return;
    }

    userList.innerHTML = '';
    users.forEach(user => {
        userList.innerHTML += `
            <tr>
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>${user.direction ? user.direction.name : "No asignado"}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning btn-sm" onclick="editUser('${user.id}', '${user.username}', '${user.role}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}', '${user.username}')">Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    });
}


// Crear o actualizar usuario
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (currentUserId) {
        await updateUser();
    } else {
        await createUser();
    }
});


// Crear usuario
async function createUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const directionId = parseInt(document.getElementById('direction').value) || null;

    console.log("Rol enviado al backend:", role);
    console.log("Direction ID enviado al backend:", directionId);

    try {
        const response = await fetchWithAuth('/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role, directionId })
        });
        const data = await response.json();

        if (response.ok && data.success) {
            alert("Usuario creado exitosamente.");
            loadUsers(1);
            resetForm();

            // Registrar creación de usuario en la auditoría
            await logAudit('Creación de Usuario', `Creó el usuario ${username} con rol ${role}`);
        } else {
            console.error("Error en respuesta:", data);
            alert(data.message || "Error al crear el usuario");
        }
    } catch (error) {
        console.error("Error al crear usuario:", error);
    }
}


// Actualizar usuario
async function updateUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const directionId = document.getElementById('direction').value || null;

    try {
        const response = await fetchWithAuth(`/admin/users/${currentUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role, directionId })
        });
        const data = await response.json();

        if (response.ok && data.success) {
            alert("Usuario actualizado exitosamente.");
            loadUsers(1); // Recargar la lista de usuarios
            resetForm(); // Restablecer el formulario
        } else {
            handleError(data.message || "Error al actualizar el usuario");
        }
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
    }
}


// Función para buscar usuarios
async function searchUser() {
    const searchTerm = document.getElementById("searchUser").value.trim();
    if (!searchTerm) {
        alert("Por favor, ingrese un término de búsqueda.");
        return;
    }

    try {
        const response = await fetchWithAuth(`/admin/users/search?query=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        if (response.ok && data.success) {
            renderUsers(data.users);
            setupPagination(data.totalPages, 1, searchUser, "userPaginationControls");
        } else {
            alert(data.message || "No se encontraron resultados.");
        }
    } catch (error) {
        console.error("Error al buscar usuario:", error);
        alert("Ocurrió un error al realizar la búsqueda.");
    }
}



// Función para eliminar un usuario
async function deleteUser(userId, username) {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
        try {
            const response = await fetchWithAuth(`/admin/users/${userId}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (response.ok && data.success) {
                alert("Usuario eliminado exitosamente.");
                loadUsers(1);

                // Registrar eliminación de usuario en la auditoría solo si es exitosa
                await logAudit('Eliminación de Usuario', `Eliminó el usuario ${username}`);
            } else {
                handleError(data.message || "Respuesta inesperada");
            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            handleError(error.message);
        }
    }
}


// Función para reiniciar formulario y eliminar `currentUserId`
function resetForm() {
    document.getElementById('userForm').reset();
    document.getElementById('submitUserButton').innerText = 'Crear Usuario';
    document.getElementById('directionField').style.display = "none";
    currentUserId = null;
}

// Cargar y mostrar los folios con paginación
async function loadFolios(page = 1) {
    try {
        const response = await fetchWithAuth(`/folios?page=${page}&limit=10`);
        const data = await response.json();

        if (response.ok && data.success) {
            renderFolios(data.folios);
            setupPagination(data.totalPages, page, loadFolios, "folioPaginationControls");
        } else {
            handleError(data.message || "Respuesta inesperada");
        }
    } catch (error) {
        handleError(error.message);
    }
}

// Renderizar los folios en la tabla
function renderFolios(folios) {
    const folioTableBody = document.getElementById("folioTableBody");
    folioTableBody.innerHTML = '';

    folios.forEach(folio => {
        const username = folio.folioUser ? folio.folioUser.username : "Usuario no asignado";
        folioTableBody.innerHTML += `
            <tr>
                <td>${folio.folioNumber || "N/A"}</td>
                <td>${username}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteFolio('${folio.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}


// Función para eliminar un folio
async function deleteFolio(folioId) {
    if (confirm("¿Estás seguro de que quieres eliminar este folio?")) {
        try {
            const response = await fetchWithAuth(`/folios/${folioId}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (response.ok && data.success) {
                alert("Folio eliminado exitosamente.");
                loadFolios(1);
            } else if (response.status === 404) {
                alert("El folio ya no existe.");
            } else {
                handleError(data.message || "Respuesta inesperada");
            }
        } catch (error) {
            console.error("Error al eliminar folio:", error);
            handleError(error.message);
        }
    }
}

// Configuración de los controles de paginación
function setupPagination(totalPages, currentPage, loadFunction, paginationContainerId) {
    const paginationContainer = document.getElementById(paginationContainerId);
    if (!paginationContainer) {
        console.error(`Elemento de paginación ${paginationContainerId} no encontrado`);
        return;
    }

    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'btn-sm', 'mx-1');
        button.innerText = i;
        button.disabled = i === currentPage;
        button.addEventListener('click', () => loadFunction(i));
        paginationContainer.appendChild(button);
    }
}

// Función para buscar folios 
async function searchFolios() {
    const searchTerm = document.getElementById("folioSearch").value.trim();
    if (!searchTerm) {
        alert("Por favor, ingrese un término de búsqueda.");
        return;
    }

    console.log("Iniciando búsqueda de folios con el término:", searchTerm);

    try {
        const response = await fetchWithAuth(`/folios/search?search=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();

        console.log("Respuesta del servidor para la búsqueda:", data);

        if (response.ok && data.success) {
            if (data.folios && data.folios.length > 0) {
                renderFolios(data.folios);
                setupPagination(data.totalPages, 1, searchFolios, "folioPaginationControls");
            } else {
                alert("No se encontraron resultados para el término de búsqueda.");
                renderFolios([]); // Limpia la tabla si no hay resultados
            }
        } else {
            console.warn("Hubo un problema con la búsqueda:", data.message);
            alert(data.message || "No se encontraron resultados.");
        }
    } catch (error) {
        console.error("Error al buscar folios:", error);
        alert("Ocurrió un error al realizar la búsqueda.");
    }
}


// Función para cargar los datos del usuario en el formulario para edición
function editUser(userId, username, role) {
    currentUserId = userId; // Guarda el ID del usuario en edición

    // Cargar los datos del usuario en los campos del formulario
    document.getElementById("username").value = username;
    document.getElementById("role").value = role;

    // Mostrar el campo de dirección si el rol es "oficina de partes direccion"
    toggleDirectionField();

    // Cambiar el texto del botón de envío a "Actualizar Usuario"
    document.getElementById("submitUserButton").innerText = "Actualizar Usuario";
}




// Inicializar la interfaz con el campo de dirección oculto
toggleDirectionField();
