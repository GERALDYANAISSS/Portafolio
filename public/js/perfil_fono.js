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
