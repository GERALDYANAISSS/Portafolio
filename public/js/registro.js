document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const rut = document.getElementById("rut").value;
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value || null;
    const tipoUsuario = document.getElementById("tipoUsuario").value;

    console.log("Formulario completado:", { nombre, apellido, rut, correo, password, fechaNacimiento, telefono, direccion, tipoUsuario });

    let isValid = true;

    if (!nombre || !apellido) {
        document.getElementById("errorNombre").innerText = "El nombre y apellido son obligatorios.";
        isValid = false;
    } else {
        document.getElementById("errorNombre").innerText = "";
    }

    // (Omitiendo algunas validaciones para simplicidad)

    if (!isValid) {
        console.log("Error de validación");
        document.querySelector(".alerta-error").style.display = "block";
        setTimeout(() => {
            document.querySelector(".alerta-error").style.display = "none";
        }, 3000);
        return;
    }

    console.log("Datos validados, enviando al servidor...");

    try {
        const response = await fetch('/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, apellido, rut, correo, password, fechaNacimiento, telefono, direccion, tipoUsuario })
        });

        console.log("Respuesta del servidor recibida");

        const result = await response.json();

        if (result.success) {
            document.querySelector(".alerta-exito").style.display = "block";
            setTimeout(() => {
                window.location.href = "iniciarsesion";
            }, 2000);
        } else {
            document.querySelector(".alerta-error").style.display = "block";
            document.querySelector(".alerta-error").innerText = result.message || 'Error en el registro';
            console.log("Error en el registro:", result.message);
            setTimeout(() => {
                document.querySelector(".alerta-error").style.display = "none";
            }, 3000);
        }
    } catch (error) {
        console.error("Error en la solicitud de registro:", error);
        document.querySelector(".alerta-error").style.display = "block";
        document.querySelector(".alerta-error").innerText = "Error en el servidor";
        setTimeout(() => {
            document.querySelector(".alerta-error").style.display = "none";
        }, 3000);
    }
});
