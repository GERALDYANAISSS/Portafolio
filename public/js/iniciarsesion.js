document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    let valid = true;

    // Validar Correo Electrónico
    const email = document.getElementById("email");
    const emailErrorId = "emailError"; // ID único para el mensaje de error
    let emailError = document.getElementById(emailErrorId);

    if (!emailError) {
        emailError = document.createElement("div");
        emailError.id = emailErrorId;
        emailError.className = "error-message";
        email.insertAdjacentElement("afterend", emailError);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
        emailError.textContent = "Ingrese un correo electrónico válido.";
        valid = false;
    } else {
        emailError.textContent = "";
    }

    // Validar Contraseña
    const password = document.getElementById("password");
    const passwordErrorId = "passwordError"; // ID único para el mensaje de error
    let passwordError = document.getElementById(passwordErrorId);

    if (!passwordError) {
        passwordError = document.createElement("div");
        passwordError.id = passwordErrorId;
        passwordError.className = "error-message";
        password.insertAdjacentElement("afterend", passwordError);
    }

    if (!password.value.trim() || password.value.length < 6) {
        passwordError.textContent = "La contraseña debe tener al menos 6 caracteres.";
        valid = false;
    } else {
        passwordError.textContent = "";
    }

    if (!valid) {
        return; // Si hay errores, detener el proceso
    }

    // Código original para la solicitud al servidor
    try {
        const response = await fetch('/iniciarsesion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email.value.trim(), password: password.value.trim() })
        });

        if (!response.ok) {
            // Manejar errores HTTP
            console.error("Error HTTP:", response.status);
            alert("Error: No se pudo iniciar sesión. Código: " + response.status);
            return;
        }

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.data.user));
            alert("Inicio de sesión exitoso");

            // Redirigir según el tipo de usuario
            if (result.data.user.tipo_usuario === 'fonoaudiologa') {
                window.location.href = "/perfil_fono";
            } else if (result.data.user.tipo_usuario === 'padre') {
                window.location.href = "/perfil_paciente";
            }
        } else {
            console.error("Error en el inicio de sesión:", result.message);
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error en el servidor:", error);
        alert("Error en el servidor. Inténtalo de nuevo.");
    }
});
