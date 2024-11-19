// middle2.js

document.addEventListener("DOMContentLoaded", () => {
    const createFolioBtn = document.getElementById("createFolioBtn");
    const viewFoliosBtn = document.getElementById("viewFoliosBtn");
    const logoutButton = document.getElementById("logoutButton");

    // Verificar que el usuario tiene una sesión activa
    if (!localStorage.getItem("accessToken")) {
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        window.location.href = "index.html";
        return;
    }

    // Redirigir a la página de creación de folio para oficina de municipal
    if (createFolioBtn) {
        createFolioBtn.addEventListener("click", () => {
            window.location.href = "dashboard_municipal.html"; 
        });
    }

    // Redirigir a la página de visualización de folios para oficina de dirección
    if (viewFoliosBtn) {
        viewFoliosBtn.addEventListener("click", () => {
            window.location.href = "view_municipalFolios.html"; 
        });
    }

    // Cerrar sesión y limpiar tokens de almacenamiento local
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "index.html";
        });
    }
});
