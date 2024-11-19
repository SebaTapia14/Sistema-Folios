document.addEventListener("DOMContentLoaded", () => {
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const closeForgotPasswordModal = document.getElementById("closeForgotPasswordModal");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");

    // Mostrar el modal
    forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        forgotPasswordModal.classList.remove("hidden");
    });

    // Cerrar el modal
    closeForgotPasswordModal.addEventListener("click", () => {
        forgotPasswordModal.classList.add("hidden");
    });

    // Enviar solicitud de restablecimiento de contraseña
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
                alert("Enlace de restablecimiento enviado a tu correo.");
                forgotPasswordModal.classList.add("hidden");
            } else {
                alert(result.message || "Error al enviar el correo.");
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
        }
    });
});
