document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.querySelector(".save-button");

    saveButton.addEventListener("click", async () => {
        // Obtener los datos del formulario
        const nombre = document.getElementById("patient-name").value.trim();
        const edad = parseInt(document.getElementById("patient-age").value.trim());
        const nivel_ed = document.getElementById("patient-education").value.trim();
        const rut = document.getElementById("patient-rut").value.trim();
        const fech_nac = document.getElementById("patient-birthdate").value;

        // Validar que el usuario esté logueado
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
            alert("No se encontró un usuario activo. Por favor, inicie sesión.");
            return;
        }

        const id_tutor = user.id; // Obtener el ID del tutor desde el usuario activo

        // Validar que los campos requeridos no estén vacíos
        if (!nombre || !edad || !rut || !fech_nac) {
            alert("Por favor, complete todos los campos obligatorios.");
            return;
        }

        // Enviar los datos al servidor
        try {
            const response = await fetch("/infante", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    edad,
                    nivel_ed,
                    rut,
                    fech_nac,
                    id_tutor
                })
            });

            const result = await response.json();

            if (result.success) {
                alert("Paciente agregado exitosamente.");
                window.location.href = "/cargas"; // Redirigir a la página de gestión de cargas
            } else {
                alert(`Error al agregar el paciente: ${result.message}`);
            }
        } catch (error) {
            console.error("Error en el servidor:", error);
            alert("Hubo un error en el servidor. Inténtelo nuevamente.");
        }
    });
});
