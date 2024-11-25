const API_BASE_URL = "http://10.4.130.176";

document.addEventListener("DOMContentLoaded", () => {
    const folioForm = document.getElementById("folioForm");
    const folioTableBody = document.getElementById("folioTableBody");
    const paginationControls = document.getElementById("paginationControls");

    let currentPage = 1;
    const itemsPerPage = 10;

    // Elementos del modal
    const descriptionModal = document.getElementById("descriptionModal");
    const modalText = document.getElementById("modalText");
    const closeModal = document.getElementById("closeModal");


    // Función para abrir el modal
    window.showModal = function (text) {
        modalText.textContent = text; // Inserta la descripción en el modal
        descriptionModal.style.display = "block"; // Muestra el modal
    };

    // Cerrar modal al hacer clic en el botón de cierre
    closeModal.addEventListener("click", () => {
        descriptionModal.style.display = "none";
    });

    // Cerrar modal al hacer clic fuera del modal
    window.addEventListener("click", (event) => {
        if (event.target === descriptionModal) {
            descriptionModal.style.display = "none";
        }
    });

    // Exponer la función al ámbito global
    window.showModal = showModal;

    if (!folioForm) {
        console.error("Formulario no encontrado en la página");
        return;
    }

    // Cargar opciones de dirección y tipo de documento al iniciar
    loadDirectionOptions();
    loadDocumentTypeOptions();

    // Crear un folio al enviar el formulario
    folioForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const directionId = document.getElementById("direction")?.value;
        const typeId = document.getElementById("type")?.value;
        const topic = document.getElementById("topic")?.value;
        const description = document.getElementById("description")?.value;
        const observations = document.getElementById("observations")?.value;

        if (!directionId || !typeId || !topic) {
            alert("Por favor, complete todos los campos requeridos.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/municipal/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({ directionId, typeId, topic, description, observations })
            });

            const data = await response.json();
            if (response.ok) {
                alert("Folio creado exitosamente");
                loadFolios(currentPage);
                folioForm.reset();
            } else {
                alert("Error al crear folio: " + (data.message || "Respuesta inesperada"));
            }
        } catch (error) {
            console.error("Error al crear folio:", error);
            alert("Error de conexión con el servidor.");
        }
    });

    // Función para cargar y mostrar folios con paginación
    async function loadFolios(page) {
        try {
            const response = await fetch(`${API_BASE_URL}/municipal?page=${page}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (response.ok) {
                const { folios, totalPages } = await response.json();
                console.log('Datos recibidos para los folios municipales:', { folios, totalPages });
                if (!Array.isArray(folios)) {
                    throw new Error("El campo 'folios' no es un array");
                }
                renderFolios(folios);
                renderPagination(totalPages, page);
            } else {
                console.error('Error al cargar folios municipales');
            }
        } catch (error) {
            console.error('Error de conexión con el servidor:', error);
        }
    }

    loadFolios(currentPage); // Cargar los folios al iniciar   

    // Renderizar folios en la tabla
    const renderFolios = (folios) => {
        if (!Array.isArray(folios)) {
            console.error("El campo 'folios' no es un array:", folios);
            return;
        }

        const folioTable = document.getElementById("folioTableBody");

        if (!folioTable) {
            console.error("Elemento con id 'folioTableBody' no encontrado en el DOM.");
            return;
        }

        // Limpiar la tabla antes de llenarla
        folioTable.innerHTML = "";

        folios.forEach((folio) => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${folio.folioNumber || "N/A"}</td>
            <td>${folio.folioDirection?.name || "N/A"}</td>
            <td>${folio.folioDocumentType?.name || "N/A"}</td>
            <td>${folio.topic || "N/A"}</td>
            <td>${new Date(folio.dateCreated).toLocaleDateString()}</td>
            <td>
                ${folio.description 
                    ? `<span class="expand-icon" onclick="showModal('${folio.description.replace(/'/g, "\\'")}')">Ver más</span>` 
                    : "Sin descripción"}
            </td>
        `;        

            folioTable.appendChild(row);
        });
    };
    
    

    // Renderizar controles de paginación
    function renderPagination(totalPages, currentPage) {
        if (!paginationControls) return;

        paginationControls.innerHTML = ""; // Limpiar los controles de paginación

        if (currentPage > 1) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "Anterior";
            prevButton.onclick = () => loadFolios(currentPage - 1);
            paginationControls.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.disabled = i === currentPage;
            pageButton.onclick = () => loadFolios(i);
            paginationControls.appendChild(pageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement("button");
            nextButton.textContent = "Siguiente";
            nextButton.onclick = () => loadFolios(currentPage + 1);
            paginationControls.appendChild(nextButton);
        }
    }


    // Cambiar de página
    function changePage(page) {
        currentPage = page;
        loadFolios(currentPage);
    }

    // Cargar opciones de direcciones
    async function loadDirectionOptions() {
        const directionSelector = document.getElementById("direction");
        if (!directionSelector) return;

        try {
            const response = await fetch(`${API_BASE_URL}/directions`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                directionSelector.innerHTML = '<option value="" disabled selected>Seleccione una dirección</option>';
                data.directions.forEach(direction => {
                    const option = document.createElement("option");
                    option.value = direction.id;
                    option.text = `${direction.name} (${direction.code})`;
                    directionSelector.add(option);
                });
            } else {
                console.error("Error al cargar direcciones.");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor para direcciones:", error);
        }
    }

    // Función para cargar la información del usuario
async function loadUserInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/user-info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Información del usuario:', data);

            // Muestra la información del usuario
            const userElement = document.getElementById('userInfo');
            userElement.innerHTML = `
                <p><strong>Usuario:</strong> ${data.user.username}</p>
                <p><strong>Rol:</strong> ${data.user.role}</p>
                <p><strong>Dirección:</strong> ${
                    data.direction ? data.direction.name : 'No asignada'
                }</p>
            `;
        } else {
            console.error('Error al cargar la información del usuario');
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
    }
}

// Llamar a la función al cargar la página
async function loadUserInfo() {
    try {
        const response = await fetch("http://10.4.130.176/auth/user-info", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error del servidor:", errorData);
            alert(`Error al cargar información del usuario: ${errorData.message}`);
            return;
        }

        const data = await response.json();
        console.log("Información del usuario cargada correctamente:", data);
    } catch (error) {
        console.error("Error de conexión con el servidor:", error);
        alert("Error de conexión con el servidor.");
    }
}

async function testAuthUserInfo() {
    const response = await fetch("http://10.4.130.176/auth/user-info", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    });
    const data = await response.json();
    console.log("Datos del usuario:", data);
}
testAuthUserInfo();



// Cargar opciones de tipo de documento
async function loadDocumentTypeOptions() {
    const typeSelector = document.getElementById("type");
    if (!typeSelector) return;

    try {
        const response = await fetch(`${API_BASE_URL}/documenttypes`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            typeSelector.innerHTML = '<option value="" disabled selected>Seleccione un tipo de documento</option>';
            data.documentTypes.forEach((type) => {
                const option = document.createElement("option");
                option.value = type.id;
                option.text = `${type.name} (${type.code})`;
                typeSelector.add(option);
            });
        } else {
            console.error("Error al cargar tipos de documentos.");
        }
    } catch (error) {
        console.error("Error al conectar con el servidor para tipos de documentos:", error);
    }
}


// Cerrar sesión
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "index.html";
    });
}

// Redireccionar al hacer clic en el botón "Volver"
const backButton = document.getElementById("backButton");
if (backButton) {
    backButton.addEventListener("click", () => {
        window.location.href = "middle2.html";
    });
}
});
