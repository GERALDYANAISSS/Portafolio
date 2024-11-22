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
        const guardianName = document.getElementById('guardian-name');
        const guardianRut = document.getElementById('guardian-rut');
        const guardianCorreo = document.getElementById('guardian-correo');
        const guardianPhone = document.getElementById('guardian-phone');
        const guardianAddress = document.getElementById('guardian-address');

        if (guardianName && guardianRut && guardianCorreo && guardianPhone && guardianAddress) {
            guardianName.value = user.nombre || '';
            guardianRut.value = user.rut || '';
            guardianCorreo.value = user.email || '';
            guardianPhone.value = user.telefono || '';
            guardianAddress.value = user.direccion || '';
        } else {
            console.error("No se encontraron uno o más elementos del formulario.");
        }
    } else {
        console.error("No se encontraron datos del usuario en el localStorage.");
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
