document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem('user')); // Usuario activo

    if (!user) {
        alert("No se encontró un usuario activo. Por favor, inicie sesión.");
        window.location.href = "/home"; // Redirigir al inicio de sesión si no hay usuario
        return;
    }

    const tutorId = user.id;

    fetch('/cargas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tutorId }) // Enviar el ID del tutor en el cuerpo
    })
        .then(response => response.json())
        .then(data => {
            console.log("Pacientes recibidos:", data);
            const tableBody = document.getElementById("patients-table-body");
            tableBody.innerHTML = ""; // Limpiar tabla

            data.forEach(paciente => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${paciente.nombre}</td>
                    <td>${paciente.edad}</td>
                    <td>${paciente.nivel_ed || "No especificado"}</td>
                    <td>${paciente.rut}</td>
                    <td>${paciente.fech_nac}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error al obtener los pacientes:", error);
        });
    

    // Manejar el clic del botón para redirigir a /infante
    const addPatientButton = document.getElementById("add-patient-btn");
    addPatientButton.addEventListener("click", () => {
        window.location.href = "/infante";
    });
});
