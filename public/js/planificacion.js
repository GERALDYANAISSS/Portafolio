document.addEventListener("DOMContentLoaded", () => {
    cargarTutores();
    cargarPlanesGuardados();
});

// Cargar los tutores desde Supabase
async function cargarTutores() {
    try {
        const response = await fetch('/tutores');
        const tutores = await response.json();

        const selectTutor = document.getElementById('nombreTutor');
        selectTutor.innerHTML = '<option value="">Seleccione un tutor</option>'; // Limpiar y agregar opción por defecto

        tutores.forEach(tutor => {
            const option = document.createElement('option');
            option.value = tutor.usuario_id; // Asegurar que el value es el ID del tutor
            option.textContent = tutor.nombre; // El texto visible será el nombre del tutor
            selectTutor.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar tutores:", error);
    }
}

// Cargar los pacientes asociados al tutor seleccionado
async function cargarPacientes() {
    const tutorId = document.getElementById('nombreTutor').value;

    if (!tutorId) {
        document.getElementById('rut').value = '';
        document.getElementById('telefono').value = '';
        return;
    }

    try {
        // Obtener datos del tutor
        const responseTutor = await fetch(`/tutor/${tutorId}`);
        const tutor = await responseTutor.json();
        document.getElementById('rut').value = tutor.rut;
        document.getElementById('telefono').value = tutor.telefono;

        // Obtener pacientes asociados al tutor
        const responsePacientes = await fetch(`/pacientes/${tutorId}`);
        const pacientes = await responsePacientes.json();

        const selectPaciente = document.getElementById('nombrePaciente');
        selectPaciente.innerHTML = '<option value="">Seleccione un paciente</option>';
        pacientes.forEach(paciente => {
            const option = document.createElement('option');
            option.value = paciente.id;
            option.textContent = paciente.nombre;
            selectPaciente.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar pacientes:", error);
    }
}

// Cargar datos del paciente seleccionado
async function cargarDatosPaciente() {
    const pacienteId = document.getElementById('nombrePaciente').value;

    if (!pacienteId) {
        document.getElementById('edadPaciente').value = '';
        return;
    }

    try {
        const response = await fetch(`/paciente/${pacienteId}`);
        const paciente = await response.json();
        document.getElementById('edadPaciente').value = paciente.edad;
    } catch (error) {
        console.error("Error al cargar datos del paciente:", error);
    }
}

// Guardar el plan
async function guardarPlan() {
        // Obtener el ID del usuario logueado desde el localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const fonoaudiologaId = user?.id; 
    const plan = {
        tutorId: document.getElementById('nombreTutor').value,
        pacienteId: document.getElementById('nombrePaciente').value,
        diagnostico: document.getElementById('diagnostico').value.trim(),
        objetivos: document.getElementById('objetivos').value.trim(),
        descripcionPlan: document.getElementById('descripcionPlan').value.trim(),
        observaciones: document.getElementById('observaciones').value.trim(),
        fonoaudiologa_id: fonoaudiologaId,
    };

    if (!plan.tutorId || !plan.pacienteId) {
        alert("Seleccione un tutor y un paciente.");
        return;
    }

    try {
        const response = await fetch('/planificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plan)
        });

        const result = await response.json();
        if (result.success) {
            alert("Plan guardado exitosamente.");
            window.location.reload();
        } else {
            alert("Error al guardar el plan: " + result.message);
        }
    } catch (error) {
        console.error("Error al guardar el plan:", error);
    }
}


async function cargarPlanesGuardados() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.tipo_usuario !== "fonoaudiologa") {
        alert("No se encontró un usuario activo o no tiene permisos para ver los planes.");
        return;
    }

    const fonoaudiologaId = user.id;

    try {
        const response = await fetch(`/planes?fonoaudiologaId=${fonoaudiologaId}`);
        const planes = await response.json();

        const planesContainer = document.getElementById("planesContainer");
        planesContainer.innerHTML = "";

        if (!Array.isArray(planes) || planes.length === 0) {
            planesContainer.innerHTML = "<p>No hay planes guardados.</p>";
            return;
        }

        planes.forEach(plan => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h3>${plan.paciente?.nombre || "Paciente sin Nombre"}</h3>
                <p><strong>Tutor:</strong> ${plan.usuarios?.nombre || "Tutor sin Nombre"}</p>
                <p><strong>Diagnóstico:</strong> ${plan.diagnostico || "Sin Diagnóstico"}</p>
                <p><strong>Objetivos:</strong> ${plan.objetivos || "Sin Objetivos"}</p>
                <p><strong>Descripción:</strong> ${plan.descripcion || "Sin Descripción"}</p>
                <div class="actions">
                    <button onclick="descargarPlan(${plan.plan_id})">Descargar Plan</button>
                    <button onclick="eliminarPlan(${plan.plan_id})" class="delete-button">Eliminar</button>
                </div>
            `;

            planesContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar los planes:", error);
        document.getElementById("planesContainer").innerHTML = "<p>Error al cargar los planes.</p>";
    }
}

// Función para descargar el PDF del plan
function descargarPlan(planId) {
    const url = `/planes/${planId}/pdf`;
    window.open(url, '_blank'); // Abre el PDF en una nueva pestaña o descarga directamente
}


// Función para eliminar un plan
async function eliminarPlan(planId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este plan?")) return;

    try {
        const response = await fetch(`/planes/${planId}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        if (result.success) {
            alert("Plan eliminado exitosamente.");
            window.location.reload(); // Recargar la página para actualizar la lista
        } else {
            alert(`Error al eliminar el plan: ${result.message}`);
        }
    } catch (error) {
        console.error("Error al eliminar el plan:", error);
        alert("Error al eliminar el plan. Inténtelo nuevamente.");
    }
}