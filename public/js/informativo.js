function downloadFile(filePath) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop();
    link.click();
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".menu-list a[href='/home']");

    const user = JSON.parse(localStorage.getItem('user'));
    // Mostrar el item solo si el tipo de usuario es 'padre'
    document.getElementById('gestionCargas').style.display = user?.tipo_usuario === 'padre' ? 'block' : 'none';

    if (logoutButton) {
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace

            try {
                // Solicitar cierre de sesión al servidor
                const response = await fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (result.success) {
                    // Eliminar los datos del usuario del localStorage
                    localStorage.removeItem('user');

                    // Redirigir al home después del cierre de sesión
                    window.location.href = "/home";
                } else {
                    console.error("Error al cerrar sesión:", result.message);
                    alert("Hubo un problema al cerrar sesión. Inténtelo nuevamente.");
                }
            } catch (err) {
                console.error("Error inesperado:", err);
                alert("Hubo un error inesperado. Inténtelo nuevamente.");
            }
        });
    }
});    