document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const loginCorreo = document.getElementById("loginCorreo").value;
    const loginPassword = document.getElementById("loginPassword").value;

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.correo === loginCorreo && user.password === loginPassword) {
        alert("Inicio de sesión exitoso");
        // Redirigir a la página de inicio u otra página protegida
        window.location.href = "home.html";
    } else {
        document.querySelector(".alerta-error").style.display = "block";
        setTimeout(() => {
            document.querySelector(".alerta-error").style.display = "none";
        }, 3000);
    }
});
