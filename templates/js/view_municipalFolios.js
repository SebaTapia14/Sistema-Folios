const API_BASE_URL = "http://10.4.130.176";
let currentPage = 1;
const limit = 10;

document.addEventListener("DOMContentLoaded", () => {
    loadFolios(currentPage);
});

// Cargar los folios y mostrarlos en la tabla
async function loadFolios(page) {
    const folioTableBody = document.getElementById("folioTableBody");

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/municipal?page=${page}&limit=${limit}`);
        
        if (response.ok) {
            const { folios, totalPages } = await response.json();
            renderFolios(folioTableBody, folios);
            renderPagination(totalPages, page);
        } else {
            console.error("Error al cargar los folios.");
            alert("Error al cargar los folios.");
        }
    } catch (error) {
        console.error("Error de conexión con el servidor:", error);
        alert("Error de conexión con el servidor.");
    }
}

// Renderizar folios en la tabla, incluyendo "Ver más" para textos largos
function renderFolios(folioTableBody, folios) {
    folioTableBody.innerHTML = '';
    folios.forEach(folio => {
        const description = truncateText(folio.description || "Sin descripción", 50);
        const observations = truncateText(folio.observations || "Sin observaciones", 50);

        folioTableBody.innerHTML += `
            <tr>
                <td>${folio.folioNumber || "N/A"}</td>
                <td>${folio.directionName || "N/A"}</td>
                <td>${folio.documentTypeName || "N/A"}</td>
                <td>${folio.topic || "N/A"}</td>
                <td>${new Date(folio.dateCreated).toLocaleDateString()}</td>
                <td class="expandable">
                    ${description} <span class="expand-icon" onclick="openModal('${folio.description || "Sin descripción"}')">▼</span>
                </td>
                <td class="expandable">
                    ${observations} <span class="expand-icon" onclick="openModal('${folio.observations || "Sin observaciones"}')">▼</span>
                </td>
            </tr>
        `;
    });
}

// Función para truncar el texto
function truncateText(text, maxLength) {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

// Función para abrir el modal y mostrar el texto completo
function openModal(fullText) {
    const modal = document.getElementById("modal");
    const modalText = document.getElementById("modalText");
    
    modalText.textContent = fullText; // Establece el texto completo en el modal
    modal.style.display = "block"; // Muestra el modal
}

// Cerrar el modal
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none"; // Oculta el modal
}

// Renderizar botones de paginación numerados
function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById("paginationControls");
    paginationContainer.innerHTML = ''; // Limpia el contenedor de paginación

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("page-button");

        if (i === currentPage) {
            pageButton.classList.add("active"); // Marca la página actual
            pageButton.disabled = true; // Deshabilita el botón de la página actual
        }

        // Cambiar de página al hacer clic
        pageButton.addEventListener("click", () => {
            loadFolios(i);
        });

        paginationContainer.appendChild(pageButton);
    }
}

// Función para manejar solicitudes con token de autenticación
async function fetchWithAuth(url, options = {}) {
    const accessToken = localStorage.getItem("accessToken");
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${accessToken}`
        }
    });

    // Si el token expiró, redirigir al login
    if (response.status === 401) {
        alert("Sesión expirada. Inicie sesión nuevamente.");
        window.location.href = "index.html";
    }

    return response;
}

// Redireccionar al hacer clic en el botón "Volver"
document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = "middle2.html";
});

// Cerrar el modal al hacer clic fuera de él
window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        closeModal();
    }
});
