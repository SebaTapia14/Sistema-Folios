// middle.js

document.addEventListener("DOMContentLoaded", () => {
    const createFolioBtn = document.getElementById("createFolioBtn");
    const viewFoliosBtn = document.getElementById("viewFoliosBtn");

    // Verificar que los botones existen antes de agregar eventos
    if (createFolioBtn) {
        // Redirigir a la página de creación de folio
        createFolioBtn.addEventListener("click", () => {
            window.location.href = "dashboard_direction.html";  // Página para crear un nuevo folio
        });
    }

    if (viewFoliosBtn) {
        // Redirigir a la página de visualización de folios
        viewFoliosBtn.addEventListener("click", () => {
            window.location.href = "view_directionFolios.html";  // Página para ver los folios existentes
        });
    }
});
