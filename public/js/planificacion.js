let editIndex = -1; // Variable para rastrear el índice del plan que se está editando

window.onload = function() {
    mostrarPlanes();
};

// Función para guardar el plan en localStorage
function guardarPlan() {
    const plan = {
        diagnostico: document.getElementById("diagnostico").value,
        objetivos: document.getElementById("objetivos").value,
        nombrePaciente: document.getElementById("nombrePaciente").value,
        edadPaciente: document.getElementById("edadPaciente").value,
        nombreTutor: document.getElementById("nombreTutor").value,
        rut: document.getElementById("rut").value,
        telefono: document.getElementById("telefono").value,
        ocupacion: document.getElementById("ocupacion").value,
        descripcionPlan: document.getElementById("descripcionPlan").value,
        observaciones: document.getElementById("observaciones").value
    };

    let planes = JSON.parse(localStorage.getItem("planes")) || [];

    if (editIndex === -1) {
        // Si no se está editando, agregar un nuevo plan
        planes.push(plan);
    } else {
        // Si se está editando, actualizar el plan existente
        planes[editIndex] = plan;
        editIndex = -1; // Reiniciar el índice de edición
    }

    localStorage.setItem("planes", JSON.stringify(planes));
    mostrarPlanes();
    document.getElementById("planForm").reset();
}

// Función para mostrar los planes guardados
function mostrarPlanes() {
    const planes = JSON.parse(localStorage.getItem("planes")) || [];
    const planesList = document.getElementById("planesList");
    planesList.innerHTML = "";

    planes.forEach((plan, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("plan-item");

        // Título que alterna la visibilidad del contenido
        const planHeader = document.createElement("div");
        planHeader.classList.add("plan-header");
        planHeader.textContent = `Plan de ${plan.nombrePaciente}`;
        planHeader.onclick = () => {
            const content = listItem.querySelector(".plan-content");
            content.style.display = content.style.display === "none" ? "block" : "none";
        };

        // Contenido detallado, inicialmente oculto
        const planContent = document.createElement("div");
        planContent.classList.add("plan-content");
        planContent.style.display = "none";
        planContent.innerHTML = `
            <div class="plan-info">
                <strong>Diagnóstico médico:</strong> ${plan.diagnostico} <br>
                <strong>Objetivos:</strong> ${plan.objetivos} <br><br>
                <strong>Datos del Paciente</strong><br>
                <strong>Nombre:</strong> ${plan.nombrePaciente} <br>
                <strong>Edad:</strong> ${plan.edadPaciente} <br><br>
                <strong>Datos del Padre o Tutor</strong><br>
                <strong>Nombre y Apellido:</strong> ${plan.nombreTutor} <br>
                <strong>RUT:</strong> ${plan.rut} <br>
                <strong>Teléfono:</strong> ${plan.telefono} <br>
                <strong>Ocupación:</strong> ${plan.ocupacion} <br><br>
                <strong>Descripción del Plan:</strong> ${plan.descripcionPlan} <br>
                <strong>Observaciones:</strong> ${plan.observaciones} <br>
            </div>
            <div class="buttons">
                <button onclick="editarPlan(${index})">Editar</button>
                <button onclick="descargarPlan(${index})">Descargar</button>
                <button onclick="eliminarPlan(${index})">Eliminar</button>
            </div>
        `;

        listItem.appendChild(planHeader);
        listItem.appendChild(planContent);
        planesList.appendChild(listItem);
    });
}

// Función para cargar los datos de un plan en el formulario para editar
function editarPlan(index) {
    const planes = JSON.parse(localStorage.getItem("planes"));
    const plan = planes[index];

    document.getElementById("diagnostico").value = plan.diagnostico;
    document.getElementById("objetivos").value = plan.objetivos;
    document.getElementById("nombrePaciente").value = plan.nombrePaciente;
    document.getElementById("edadPaciente").value = plan.edadPaciente;
    document.getElementById("nombreTutor").value = plan.nombreTutor;
    document.getElementById("rut").value = plan.rut;
    document.getElementById("telefono").value = plan.telefono;
    document.getElementById("ocupacion").value = plan.ocupacion;
    document.getElementById("descripcionPlan").value = plan.descripcionPlan;
    document.getElementById("observaciones").value = plan.observaciones;

    editIndex = index; // Establecer el índice del plan que se está editando
}

// Función para descargar el plan en PDF
function descargarPlan(index) {
    const planes = JSON.parse(localStorage.getItem("planes"));
    const plan = planes[index];

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text("Plan de Tratamiento", 10, 10);
    doc.text(`Diagnóstico médico: ${plan.diagnostico}`, 10, 20);
    doc.text(`Objetivos: ${plan.objetivos}`, 10, 30);
    doc.text("Datos del Paciente", 10, 40);
    doc.text(`Nombre: ${plan.nombrePaciente}`, 10, 50);
    doc.text(`Edad: ${plan.edadPaciente}`, 10, 60);
    doc.text("Datos del Padre o Tutor", 10, 70);
    doc.text(`Nombre y Apellido: ${plan.nombreTutor}`, 10, 80);
    doc.text(`RUT: ${plan.rut}`, 10, 90);
    doc.text(`Teléfono: ${plan.telefono}`, 10, 100);
    doc.text(`Ocupación: ${plan.ocupacion}`, 10, 110);
    doc.text("Descripción del Plan", 10, 120);
    doc.text(plan.descripcionPlan, 10, 130, { maxWidth: 180 });
    doc.text("Observaciones", 10, 140);
    doc.text(plan.observaciones, 10, 150, { maxWidth: 180 });

    doc.save(`Plan_${plan.nombrePaciente}.pdf`);
}

// Función para eliminar un plan con confirmación
function eliminarPlan(index) {
    if (confirm("¿Estás seguro de que deseas eliminar este plan?")) {
        let planes = JSON.parse(localStorage.getItem("planes"));
        planes.splice(index, 1);
        localStorage.setItem("planes", JSON.stringify(planes));
        mostrarPlanes();
    }
}
