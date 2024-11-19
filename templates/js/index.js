document.addEventListener("DOMContentLoaded", () => {
    const contactLink = document.getElementById("forgotPasswordLink");
    const contactModal = document.getElementById("forgotPasswordModal");
    const closeContactModal = document.getElementById("closeForgotPasswordModal");

    if (!contactLink || !contactModal || !closeContactModal) {
        console.error("Elementos necesarios para el modal no encontrados en el DOM.");
        return;
    }

    // Mostrar el modal al hacer clic en "Llama aquí"
    contactLink.addEventListener("click", (e) => {
        e.preventDefault();
        contactModal.style.display = "flex"; // Mostrar modal
    });

    // Cerrar modal al hacer clic en el botón de cerrar
    closeContactModal.addEventListener("click", () => {
        contactModal.style.display = "none"; // Ocultar modal
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener("click", (event) => {
        if (event.target === contactModal) {
            contactModal.style.display = "none";
        }
    });
});
