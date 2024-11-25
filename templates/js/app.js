// templates/js/app.js

const API_BASE_URL = "http://10.4.130.176";

// Inicializar lógica de la aplicación al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        initLoginForm(loginForm);
    }

    const folioForm = document.getElementById("folioForm");
    const folioTableBody = document.getElementById("folioTableBody");
    if (folioForm && folioTableBody) {
        initDashboard(folioForm, folioTableBody);
    }

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
});

// Función para inicializar el formulario de login
function initLoginForm(loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                handleRedirection(data.accessToken);
            } else {
                showError(data.message || "Error al iniciar sesión.");
            }
        } catch (error) {
            console.error("Error de conexión con el servidor:", error);
            showError("Error de conexión con el servidor.");
        }
    });
}

// Función para manejar la redirección según el rol del usuario
function handleRedirection(accessToken) {
    try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const userRole = payload.role;

        switch (userRole) {
            case 'admin':
                window.location.href = "admin_dashboard.html";
                break;
            case 'oficina de partes municipal':
                window.location.href = "middle2.html"; 
                break;
            case 'oficina de partes direccion':
                window.location.href = "middle.html"; 
                break;
            default:
                showError("Acceso denegado: rol no autorizado.");
        }
    } catch (decodeError) {
        console.error("Error al decodificar el token:", decodeError);
        showError("Error al procesar la respuesta del servidor.");
    }
}

// Mostrar mensaje de error en la interfaz de usuario
function showError(message) {
    const loginError = document.getElementById("loginError");
    if (loginError) {
        loginError.textContent = message;
        loginError.classList.remove("d-none");
    }
}

// Inicializar lógica del dashboard
function initDashboard(folioForm, folioTableBody) {
    folioForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const direction = document.getElementById("direction").value;
        const department = document.getElementById("department").value;
        const type = document.getElementById("type").value;
        const topic = document.getElementById("topic").value;
        const description = document.getElementById("description").value;

        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/folios/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ direction, department, type, topic, description })
            });

            if (response.ok) {
                alert("Folio creado exitosamente");
                loadFolios(folioTableBody);
                folioForm.reset();
            } else {
                const data = await response.json();
                alert("Error al crear el folio: " + (data.message || "Respuesta inesperada"));
            }
        } catch (error) {
            console.error("Error al crear folio:", error);
            alert("Error de conexión con el servidor.");
        }
    });

    loadFolios(folioTableBody);
}

// Cargar y mostrar folios en la tabla
async function loadFolios(folioTableBody) {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/folios`);
        if (response.ok) {
            const { folios } = await response.json();
            renderFolios(folioTableBody, folios);
        } else {
            const data = await response.json();
            console.error("Error al cargar los folios:", data.message);
            alert("Error al cargar los folios: " + (data.message || "Respuesta inesperada"));
        }
    } catch (error) {
        console.error("Error al cargar los folios:", error);
        alert("Error de conexión con el servidor.");
    }
}

// Renderizar los folios en la tabla
function renderFolios(folioTableBody, folios) {
    folioTableBody.innerHTML = '';
    folios.forEach(folio => {
        folioTableBody.innerHTML += `
            <tr>
                <td>${folio.folioNumber || "N/A"}</td>
                <td>${folio.direction || "N/A"}</td>
                <td>${folio.department || "N/A"}</td>
                <td>${folio.type || "N/A"}</td>
                <td>${folio.topic || "N/A"}</td>
                <td>${new Date(folio.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editFolio('${folio.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFolio('${folio.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = 'index.html';
}

// Obtener el token de acceso almacenado
function getAccessToken() {
    return localStorage.getItem("accessToken");
}

// Refrescar el token de acceso cuando expira
async function refreshToken() {
    const token = localStorage.getItem("refreshToken");
    if (!token) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        localStorage.clear();
        window.location.href = "index.html";
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("accessToken", data.accessToken);
            return data.accessToken;
        } else {
            alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
            localStorage.clear();
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error al refrescar el token:", error);
        alert("Error al refrescar la sesión. Por favor, inicia sesión nuevamente.");
        localStorage.clear();
        window.location.href = "index.html";
    }
    return null;
}

// Manejar solicitudes autenticadas con token
async function fetchWithAuth(url, options = {}) {
    let accessToken = getAccessToken();

    if (!accessToken) {
        accessToken = await refreshToken();
    }

    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${accessToken}`
        }
    });

    if (response.status === 401) {
        accessToken = await refreshToken();

        if (accessToken) {
            response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    "Authorization": `Bearer ${accessToken}`
                }
            });
        }
    }

    return response;
}
