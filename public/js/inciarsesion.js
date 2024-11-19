document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    console.log("Interceptando el envío del formulario...");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('/iniciarsesion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

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