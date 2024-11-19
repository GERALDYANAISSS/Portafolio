document.addEventListener("DOMContentLoaded", () => {
    const tipoUsuarioSelect = document.getElementById("tipoUsuario");
    const fonoaudiologaFields = document.getElementById("fonoaudiologaFields");

    // Mostrar/ocultar campos según el tipo de usuario seleccionado
    tipoUsuarioSelect.addEventListener("change", () => {
        if (tipoUsuarioSelect.value === "fonoaudiologa") {
            fonoaudiologaFields.style.display = "block";
        } else {
            fonoaudiologaFields.style.display = "none";
        }
    });
});

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const rut = document.getElementById("rut").value;
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value || null;
    const tipoUsuario = document.getElementById("tipoUsuario").value;

    // Campos adicionales para fonoaudióloga
    const universidad = document.getElementById("universidad").value || null;
    const carrera = document.getElementById("carrera").value || null;
    const especialidad = document.getElementById("especialidad").value || null;

    try {
        const response = await fetch('/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                apellido,
                rut,
                correo,
                password,
                fechaNacimiento,
                telefono,
                direccion,
                tipoUsuario,
                universidad,
                carrera,
                especialidad,
            })
        });

        const result = await response.json();

        if (result.success) {
            document.querySelector(".alerta-exito").style.display = "block";
            setTimeout(() => {
                window.location.href = "iniciarsesion";
            }, 2000);
        } else {
            document.querySelector(".alerta-error").style.display = "block";
            document.querySelector(".alerta-error").innerText = result.message || 'Error en el registro';
        }
    } catch (error) {
        console.error("Error en la solicitud de registro:", error);
        document.querySelector(".alerta-error").style.display = "block";
        document.querySelector(".alerta-error").innerText = "Error en el servidor";
    }
});
