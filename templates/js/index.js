document.addEventListener("DOMContentLoaded", () => {
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const closeForgotPasswordModal = document.getElementById("closeForgotPasswordModal");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");

    // Mostrar el modal al hacer clic en "Recupérala aquí"
    forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        forgotPasswordModal.style.display = "block"; // Mostrar modal
    });

    // Cerrar modal al hacer clic en el botón de cerrar
    closeForgotPasswordModal.addEventListener("click", () => {
        forgotPasswordModal.style.display = "none"; // Ocultar modal
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener("click", (event) => {
        if (event.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = "none";
        }
    });

    // Manejo del formulario de recuperación de contraseña
    forgotPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();

        try {
            const response = await fetch("http://localhost:3000/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Enlace de recuperación enviado a tu correo.");
                forgotPasswordModal.style.display = "none"; // Ocultar modal tras éxito
            } else {
                alert(result.message || "Error al enviar el correo de recuperación.");
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
        }
    });
});
