document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const rut = document.getElementById("rut").value;
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    // Validaciones
    let isValid = true;

    // Validar nombre y apellido
    if (!nombre || !apellido) {
        document.getElementById("errorNombre").innerText = "El nombre y apellido son obligatorios.";
        isValid = false;
    } else {
        document.getElementById("errorNombre").innerText = "";
    }

    // Validar correo
    if (!validateEmail(correo)) {
        document.getElementById("errorCorreo").innerText = "El correo no es válido.";
        isValid = false;
    } else {
        document.getElementById("errorCorreo").innerText = "";
    }

    // Validar contraseña
    if (!validatePassword(password)) {
        document.getElementById("errorPassword").innerText = "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número.";
        isValid = false;
    } else {
        document.getElementById("errorPassword").innerText = "";
    }

    if (!isValid) {
        document.querySelector(".alerta-error").style.display = "block";
        setTimeout(() => {
            document.querySelector(".alerta-error").style.display = "none";
        }, 3000);
        return;
    }

    // Guardar en localStorage si es válido
    const user = {
        nombre,
        apellido,
        rut,
        correo,
        password
    };
    localStorage.setItem("user", JSON.stringify(user));

    document.querySelector(".alerta-exito").style.display = "block";
    setTimeout(() => {
        window.location.href = "iniciar_sesion.html";
    }, 2000);
});

// Función para validar el correo
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar la contraseña
function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
}
