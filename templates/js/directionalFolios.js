const API_BASE_URL = "http://10.4.130.176"; // Ajusta la URL según tu configuración

document.addEventListener("DOMContentLoaded", async () => {
    const folioForm = document.getElementById("folioForm");
    const folioTableBody = document.getElementById("folioTableBody");
    const paginationControls = document.getElementById("paginationControls");
    const directionField = document.getElementById("direction");
    const departmentField = document.getElementById("department");
    const typeField = document.getElementById("type");
    const itemsPerPage = 10;
    let currentPage = 1;

    // Elementos del modal
    const descriptionModal = document.getElementById("descriptionModal");
    const modalText = document.getElementById("modalText");
    const closeModal = document.getElementById("closeModal");

    // Función para abrir el modal con texto
    window.showModal = function (text) {
        modalText.textContent = text; // Muestra el texto recibido en el modal
        descriptionModal.style.display = "block"; // Muestra el modal
    };

    // Función para cerrar el modal
    closeModal.addEventListener("click", () => {
        descriptionModal.style.display = "none";
    });

    // Cerrar el modal al hacer clic fuera de él
    window.addEventListener("click", (event) => {
        if (event.target === descriptionModal) {
            descriptionModal.style.display = "none";
        }
    });

    if (!folioForm) {
        console.error("Formulario no encontrado en la página");
        return;
    }

    // Función para obtener la dirección y departamentos del usuario actual
    async function loadUserInfo() {
        try {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                alert("Debe iniciar sesión para acceder a esta página.");
                window.location.href = "index.html";
                return;
            }

            const response = await fetch(`${API_BASE_URL}/auth/user-info`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const { direction, departments } = await response.json();

                if (direction) {
                    directionField.value = `${direction.name} (${direction.code})`;
                    directionField.setAttribute("data-id", direction.id);
                    directionField.disabled = true;
                }

                if (departments && departments.length > 0) {
                    departmentField.innerHTML = '<option value="" disabled selected>Seleccione un departamento</option>';
                    departments.forEach(department => {
                        departmentField.innerHTML += `<option value="${department.id}">${department.name} (${department.code})</option>`;
                    });
                    departmentField.disabled = false;
                } else {
                    departmentField.innerHTML = '<option value="" disabled>No hay departamentos disponibles</option>';
                    departmentField.disabled = true;
                }
            } else {
                alert("Error al obtener la información del usuario.");
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
        }
    }

    await loadUserInfo();

    folioForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const directionId = directionField.getAttribute("data-id");
        const departmentId = departmentField.value || null;
        const typeId = typeField.value;
        const topic = document.getElementById("topic").value.trim();
        const description = document.getElementById("description").value.trim();
        const observations = document.getElementById("observations").value.trim();

        if (!directionId || !typeId || !topic) {
            alert("Por favor complete todos los campos requeridos.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/directional/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({ directionId, departmentId, typeId, topic, description, observations })
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
            alert("Error de conexión con el servidor.");
        }
    });

    async function loadFolios(page) {
        try {
            const response = await fetch(`${API_BASE_URL}/directional?page=${page}&limit=${itemsPerPage}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (response.ok) {
                const { folios, totalPages } = await response.json();
                renderFolios(folioTableBody, folios);
                renderPagination(totalPages, page);
            } else {
                alert("Error al cargar folios.");
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
        }
    }

    loadFolios(currentPage);

    function renderFolios(folioTableBody, folios) {
        folioTableBody.innerHTML = '';
        folios.forEach(folio => {
            const createdAtDate = folio.createdAt ? new Date(folio.createdAt).toLocaleDateString() : "N/A";
            folioTableBody.innerHTML += `
                <tr>
                    <td>${folio.folioNumber || "N/A"}</td>
                    <td>${folio.directionName || "N/A"}</td>
                    <td>${folio.departmentName || "N/A"}</td>
                    <td>${folio.documentTypeName || "N/A"}</td>
                    <td>${folio.topic || "N/A"}</td>
                    <td>${createdAtDate}</td>
                    <td>
                        ${folio.description 
                            ? `<span class="expand-icon" onclick="showModal('${folio.description.replace(/'/g, "\\'")}')">Ver más</span>` 
                            : "Sin descripción"}
                    </td>
                </tr>
            `;
        });
    }

    function renderPagination(totalPages, currentPage) {
        paginationControls.innerHTML = '';

        if (currentPage > 1) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "Anterior";
            prevButton.onclick = () => changePage(currentPage - 1);
            paginationControls.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.disabled = true;
            }
            pageButton.onclick = () => changePage(i);
            paginationControls.appendChild(pageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement("button");
            nextButton.textContent = "Siguiente";
            nextButton.onclick = () => changePage(currentPage + 1);
            paginationControls.appendChild(nextButton);
        }
    }

    function changePage(page) {
        currentPage = page;
        loadFolios(currentPage);
    }

    const logoutButton = document.getElementById("logoutButton");
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "index.html";
    });
});
