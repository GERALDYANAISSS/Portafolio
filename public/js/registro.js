document.addEventListener("DOMContentLoaded", () => {
    toggleMenu();
});

// Función para alternar el menú hamburguesa
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle('active');
    });
}

// Validaciones del formulario
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita el envío si hay errores
        let valid = true;

        // Validar Nombre
        const nombre = document.getElementById("nombre");
        const errorNombre = document.getElementById("errorNombre");
        if (!nombre.value.trim() || nombre.value.trim().length < 3) {
            errorNombre.textContent = "El nombre debe tener al menos 3 caracteres.";
            valid = false;
        } else {
            errorNombre.textContent = "";
        }

        // Validar Apellido
        const apellido = document.getElementById("apellido");
        const errorApellido = document.getElementById("errorApellido");
        if (!apellido.value.trim() || apellido.value.trim().length < 3) {
            errorApellido.textContent = "El apellido debe tener al menos 3 caracteres.";
            valid = false;
        } else {
            errorApellido.textContent = "";
        }

        // Validar RUT (Chile)
        const rut = document.getElementById("rut");
        const errorRut = document.getElementById("errorRut");
        if (!validarRUT(rut.value)) {
            errorRut.textContent = "Ingrese un RUT válido.";
            valid = false;
        } else {
            errorRut.textContent = "";
        }

        // Validar Correo Electrónico
        const correo = document.getElementById("correo");
        const errorCorreo = document.getElementById("errorCorreo");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.value)) {
            errorCorreo.textContent = "Ingrese un correo electrónico válido.";
            valid = false;
        } else {
            errorCorreo.textContent = "";
        }

        // Validar Contraseña
        const password = document.getElementById("password");
        const errorPassword = document.getElementById("errorPassword");
        if (password.value.length < 6) {
            errorPassword.textContent = "La contraseña debe tener al menos 6 caracteres.";
            valid = false;
        } else {
            errorPassword.textContent = "";
        }

        // Validar Confirmación de Contraseña
        const confirmPassword = document.getElementById("confirmPassword");
        const errorConfirmPassword = document.getElementById("errorConfirmPassword");
        if (confirmPassword.value !== password.value) {
            errorConfirmPassword.textContent = "Las contraseñas no coinciden.";
            valid = false;
        } else {
            errorConfirmPassword.textContent = "";
        }

        // Validar Fecha de Nacimiento
        const fechaNacimiento = document.getElementById("fechaNacimiento");
        const errorFechaNacimiento = document.getElementById("errorFechaNacimiento");
        if (!fechaNacimiento.value) {
            errorFechaNacimiento.textContent = "Seleccione una fecha de nacimiento.";
            valid = false;
        } else {
            errorFechaNacimiento.textContent = "";
        }

        // Validar Teléfono
        const telefono = document.getElementById("telefono");
        const errorTelefono = document.getElementById("errorTelefono");
        const telefonoRegex = /^\d{9}$/; // Formato: 9 dígitos
        if (!telefonoRegex.test(telefono.value)) {
            errorTelefono.textContent = "Ingrese un número de teléfono válido (9 dígitos).";
            valid = false;
        } else {
            errorTelefono.textContent = "";
        }

        // Validar Tipo de Usuario
        const tipoUsuario = document.getElementById("tipoUsuario");
        const errorTipoUsuario = document.getElementById("errorTipoUsuario");
        if (!tipoUsuario.value) {
            errorTipoUsuario.textContent = "Seleccione un tipo de usuario.";
            valid = false;
        } else {
            errorTipoUsuario.textContent = "";
        }

        // Validar Campos Adicionales para Fonoaudióloga
        if (tipoUsuario.value === "fonoaudiologa") {
            const universidad = document.getElementById("universidad");
            const errorUniversidad = document.getElementById("errorUniversidad");
            if (!universidad.value.trim()) {
                errorUniversidad.textContent = "Ingrese el nombre de la universidad.";
                valid = false;
            } else {
                errorUniversidad.textContent = "";
            }

            const carrera = document.getElementById("carrera");
            const errorCarrera = document.getElementById("errorCarrera");
            if (!carrera.value.trim()) {
                errorCarrera.textContent = "Ingrese la carrera.";
                valid = false;
            } else {
                errorCarrera.textContent = "";
            }

            const especialidad = document.getElementById("especialidad");
            const errorEspecialidad = document.getElementById("errorEspecialidad");
            if (!especialidad.value.trim()) {
                errorEspecialidad.textContent = "Ingrese la especialidad.";
                valid = false;
            } else {
                errorEspecialidad.textContent = "";
            }
        }

        // Si todo es válido, verificar si ya está registrado
        if (valid) {
            try {
                const response = await fetch('/verificar_registro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ correo: correo.value.trim() })
                });

                const result = await response.json();
                if (result.registrado) {
                    alert("El usuario ya está registrado. Por favor, inicie sesión.");
                } else {
                    registerForm.submit(); // Enviar formulario si no está registrado
                }
            } catch (error) {
                console.error("Error al verificar registro:", error);
                alert("Error al verificar registro. Inténtelo nuevamente.");
            }
        }
    });
});

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
