document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    // Captura los valores de los campos de entrada
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Oculta los mensajes antes de cada intento de inicio de sesión
    document.querySelector(".alerta-error").style.display = "none";
    document.querySelector(".alerta-exito").style.display = "none";

    try {
        const response = await fetch('/iniciarsesion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        // Verifica el resultado de la respuesta
        if (result.success) {
            document.querySelector(".alerta-exito").style.display = "block";
            document.querySelector(".alerta-exito").innerText = "Sesión iniciada correctamente";
            setTimeout(() => {
                window.location.href = "/home"; // Redirige a la página principal o de perfil
            }, 2000);
        } else {
            document.querySelector(".alerta-error").style.display = "block";
            document.querySelector(".alerta-error").innerText = result.message || "Inicio de sesión fallido";
        }
    } catch (error) {
        console.error("Error en el servidor:", error);
        document.querySelector(".alerta-error").style.display = "block";
        document.querySelector(".alerta-error").innerText = "Error en el servidor";
    }
});
