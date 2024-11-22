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

// Función para mostrar una vista previa de la imagen seleccionada en el perfil del paciente
function previewImagePaciente(event) {
    const profilePicture = document.getElementById('profile-picture');
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePicture.src = e.target.result;
            localStorage.setItem("profileImagePaciente", e.target.result); // Guarda la imagen del paciente en localStorage
        };
        reader.readAsDataURL(file);
    }
}

// Cargar la imagen de perfil del paciente desde el localStorage al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    const savedImagePaciente = localStorage.getItem("profileImagePaciente");
    if (savedImagePaciente) {
        document.getElementById("profile-picture").src = savedImagePaciente;
    }
});