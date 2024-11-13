document.addEventListener('DOMContentLoaded', loadSavedPlans);

const form = document.getElementById('workPlanForm');
form.addEventListener('submit', savePlan);

function savePlan(event) {
    event.preventDefault();
    
    const plan = {
        diagnosis: document.getElementById('diagnosis').value,
        objectives: document.getElementById('objectives').value,
        patientName: document.getElementById('patientName').value,
        age: document.getElementById('age').value,
        parentName: document.getElementById('parentName').value,
        parentRUT: document.getElementById('parentRUT').value,
        parentPhone: document.getElementById('parentPhone').value,
        parentOccupation: document.getElementById('parentOccupation').value, // Agrega ocupación
        description: document.getElementById('description').value,
        observaciones: document.getElementById('observaciones').value
    };

    const plans = JSON.parse(localStorage.getItem('plans')) || [];
    plans.push(plan);
    localStorage.setItem('plans', JSON.stringify(plans));

    form.reset();
    loadSavedPlans();
}

function loadSavedPlans() {
    const plansList = document.getElementById('plansList');
    plansList.innerHTML = '';

    const plans = JSON.parse(localStorage.getItem('plans')) || [];

    if (plans.length === 0) {
        plansList.innerHTML = '<p>No hay planes guardados.</p>';
        return;
    }

    plans.forEach((plan, index) => {
        const planItem = document.createElement('div');
        planItem.classList.add('plan-item');
        planItem.innerHTML = `
            <h4>Plan ${index + 1}</h4>
            <p><strong>Diagnóstico:</strong> ${plan.diagnosis}</p>
            <p><strong>Objetivos:</strong> ${plan.objectives}</p>
            <p><strong>Nombre del Paciente:</strong> ${plan.patientName}</p>
            <p><strong>Edad del Paciente:</strong> ${plan.age}</p>
            <p><strong>Nombre y Apellido del Padre o Tutor:</strong> ${plan.parentName}</p>
            <p><strong>RUT del Padre o Tutor:</strong> ${plan.parentRUT}</p>
            <p><strong>Teléfono del Padre o Tutor:</strong> ${plan.parentPhone}</p>
            <p><strong>Ocupación del Padre o Tutor:</strong> ${plan.parentOccupation}</p>
            <p><strong>Descripción:</strong> ${plan.description}</p>
            <p><strong>Observaciones:</strong> ${plan.observaciones}</p>
            <button class="delete-btn" onclick="deletePlan(${index})">Eliminar</button>
        `;
        plansList.appendChild(planItem);
    });
}

function deletePlan(index) {
    const plans = JSON.parse(localStorage.getItem('plans')) || [];
    plans.splice(index, 1);
    localStorage.setItem('plans', JSON.stringify(plans));
    loadSavedPlans();
}
