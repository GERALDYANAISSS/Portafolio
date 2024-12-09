document.addEventListener("DOMContentLoaded", () => {
    // Inicialización de funciones al cargar la página
    inicializarMenuHamburguesa();
    inicializarTipoUsuario();
    inicializarFormularioRegistro();
});

// Función para alternar el menú hamburguesa
function inicializarMenuHamburguesa() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle('active');
        });
    }
}

// Función para manejar los campos adicionales según el tipo de usuario
function inicializarTipoUsuario() {
    const tipoUsuario = document.getElementById("tipoUsuario");
    const fonoaudiologaFields = document.getElementById("fonoaudiologaFields");

    if (tipoUsuario && fonoaudiologaFields) {
        tipoUsuario.addEventListener("change", () => {
            fonoaudiologaFields.style.display = tipoUsuario.value === "fonoaudiologa" ? "block" : "none";
        });
    }
}

// Función para manejar las validaciones del formulario
function inicializarFormularioRegistro() {
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Evita el envío si hay errores
            let valid = true;

            // Validar campos
            valid &= validarCampo("nombre", "El nombre debe tener al menos 3 caracteres.", value => value.trim().length >= 3);
            valid &= validarCampo("apellido", "El apellido debe tener al menos 3 caracteres.", value => value.trim().length >= 3);
            valid &= validarCampo("rut", "Ingrese un RUT válido.", validarRUT);
            valid &= validarCampo("correo", "Ingrese un correo electrónico válido.", value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
            valid &= validarCampo("password", "La contraseña debe tener al menos 6 caracteres.", value => value.length >= 6);
            valid &= validarCampo("confirmPassword", "Las contraseñas no coinciden.", value => value === document.getElementById("password").value);
            valid &= validarCampo("fechaNacimiento", "Seleccione una fecha de nacimiento.", value => value.trim() !== "");
            valid &= validarCampo("telefono", "Ingrese un número de teléfono válido (9 dígitos).", value => /^\d{9}$/.test(value));

            // Validar tipo de usuario
            const tipoUsuario = document.getElementById("tipoUsuario");
            valid &= validarCampo("tipoUsuario", "Seleccione un tipo de usuario.", value => value !== "");

            // Validar campos adicionales si el tipo de usuario es Fonoaudióloga
            if (tipoUsuario.value === "fonoaudiologa") {
                valid &= validarCampo("universidad", "Ingrese el nombre de la universidad.", value => value.trim() !== "");
                valid &= validarCampo("carrera", "Ingrese la carrera.", value => value.trim() !== "");
                valid &= validarCampo("especialidad", "Ingrese la especialidad.", value => value.trim() !== "");
            }

            // Si todo es válido, verificar si ya está registrado
            if (valid) {
                try {
                    const data = {
                        correo: document.getElementById('correo').value.trim(),
                        password: document.getElementById('password').value.trim(),
                        nombre: document.getElementById('nombre').value.trim(),
                        apellido: document.getElementById('apellido').value.trim(),
                        rut: document.getElementById('rut').value.trim(),
                        fechaNacimiento: document.getElementById('fechaNacimiento').value.trim(),
                        telefono: document.getElementById('telefono').value.trim(),
                        direccion: document.getElementById('direccion').value.trim(),
                        tipoUsuario: document.getElementById('tipoUsuario').value.trim(),
                    };

                    // Agregar datos adicionales si el tipo de usuario es fonoaudióloga
                    if (data.tipoUsuario === "fonoaudiologa") {
                        data.universidad = document.getElementById('universidad').value.trim();
                        data.carrera = document.getElementById('carrera').value.trim();
                        data.especialidad = document.getElementById('especialidad').value.trim();
                    }


                    fetch('/registro', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(result => console.log(result))
                    .catch(error => console.error('Error:', error));
                } catch (error) {
                    console.error("Error al verificar registro:", error);
                    alert("Error al verificar registro. Inténtelo nuevamente.");
                }
            }
        });
    }
}

// Función para validar campos individuales
function validarCampo(id, mensajeError, validarFn) {
    const campo = document.getElementById(id);
    const errorDiv = document.getElementById(`error${capitalize(id)}`);
    if (!validarFn(campo.value)) {
        errorDiv.textContent = mensajeError;
        return false;
    } else {
        errorDiv.textContent = "";
        return true;
    }
}

// Función para capitalizar la primera letra de una cadena
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Función para validar RUT (Chile)
function validarRUT(rut) {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false;

    const [body, dv] = rut.split("-");
    let sum = 0, multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body.charAt(i)) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const calculatedDV = 11 - (sum % 11);
    const verifiedDV = calculatedDV === 10 ? "k" : calculatedDV === 11 ? "0" : calculatedDV.toString();

    return verifiedDV.toLowerCase() === dv.toLowerCase();
}