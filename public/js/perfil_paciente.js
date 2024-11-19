document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".menu-list a[href='/home']");
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
    } else {
        console.error("No se encontraron datos válidos del usuario en el localStorage.");
    }
});    