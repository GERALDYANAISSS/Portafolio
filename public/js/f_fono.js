// Función para guardar cambios
function saveChanges() {
    alert("Los cambios han sido guardados exitosamente.");
    // Aquí puedes agregar la lógica para guardar los cambios en el servidor o en la base de datos
}

// Función para mostrar una vista previa de la imagen seleccionada
function previewImage(event) {
    const profilePicture = document.getElementById('profile-picture');
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePicture.src = e.target.result;
            localStorage.setItem("profileImage", e.target.result); // Guarda la imagen en localStorage
        };
        reader.readAsDataURL(file);
    }
}

// Cargar la imagen de perfil desde el localStorage al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        document.getElementById("profile-picture").src = savedImage;
    }
});
