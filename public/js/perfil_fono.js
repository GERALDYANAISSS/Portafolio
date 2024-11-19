// Función para cambiar la foto de perfil
function changeProfilePhoto(event) {
    const profilePhoto = document.getElementById('profilePhoto');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePhoto.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Función para abrir la agenda de Google
function openGoogleCalendar() {
    window.open("https://calendar.google.com", "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".menu-list a[href='/home']");

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

    // Cargar datos del usuario desde localStorage y asignarlos a los inputs
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("User:", user);

    if (user) {
        // Actualizar los campos con los datos del usuario
        document.getElementById('user-nombre').textContent = user.nombre || 'No disponible';
        document.getElementById('user-rut').textContent = user.rut || 'No disponible';
        document.getElementById('user-telefono').textContent = user.telefono || 'No disponible';
        document.getElementById('user-correo').textContent = user.email || 'No disponible';
        document.getElementById('user-direccion').textContent = user.direccion || 'No disponible';
        document.getElementById('user-universidad').textContent = user.universidad || 'No disponible';
        document.getElementById('user-carrera').textContent = user.carrera || 'No disponible';
        document.getElementById('user-especializacion').textContent = user.especialidad || 'No disponible';
    } else {
        console.error("No se encontraron datos válidos del usuario en el localStorage.");
    }
});
