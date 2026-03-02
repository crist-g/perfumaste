document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            enableEdit(section, btn);
        });
    });

    const modalForm = document.getElementById('modal-form');
    if (modalForm) {
        modalForm.addEventListener('submit', submitModalData);
    }
});

/* Config */

const API_URL = window.APP_CONFIG?.apiUrl || '';
const TOKEN = localStorage.getItem('token');

/* Cargar user data */

function loadProfileData() {
    fetch(`${API_URL}/user`, {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => renderProfile(data))
    .catch(err => console.error('Error cargando perfil:', err));
}

/* render perfil */

function renderProfile(data) {
    renderSection('personal', {
        name: data.name,
        email: data.email
    });

    if (data.address) {
        renderSection('address', data.address);
    } else {
        renderEmptySection('address');
    }

    if (data.payment) {
        renderSection('payment', data.payment);
    } else {
        renderEmptySection('payment');
    }
}

function renderSection(section, fields) {
    const container = document.getElementById(`${section}-info`);
    container.innerHTML = '';

    Object.entries(fields).forEach(([key, value]) => {
        const p = document.createElement('p');
        p.innerHTML = `
            <strong>${formatLabel(key)}:</strong>
            <span data-field="${key}">${value ?? '-'}</span>
        `;
        container.appendChild(p);
    });
}

function renderEmptySection(section) {
    const container = document.getElementById(`${section}-info`);
    container.innerHTML = `
        <p class="empty-data">No hay información registrada</p>
        <button class="add-btn" onclick="openModal('${section}')">
            Agregar información
        </button>
    `;
}

/* Editar / Guardar */

function enableEdit(section, button) {
    const container = document.getElementById(`${section}-info`);
    const spans = container.querySelectorAll('[data-field]');

    spans.forEach(span => {
        const input = document.createElement('input');
        input.className = 'input-edit';
        input.value = span.textContent;
        input.dataset.field = span.dataset.field;
        span.replaceWith(input);
    });

    button.textContent = 'Guardar';
    button.onclick = () => saveSection(section, button);
}

function saveSection(section, button) {
    const container = document.getElementById(`${section}-info`);
    const inputs = container.querySelectorAll('input');
    const payload = {};

    inputs.forEach(input => {
        payload[input.dataset.field] = input.value;

        const span = document.createElement('span');
        span.dataset.field = input.dataset.field;
        span.textContent = input.value;
        input.replaceWith(span);
    });

    fetch(`${API_URL}/user/${section}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify(payload)
    });

    button.textContent = 'Editar';
    button.onclick = () => enableEdit(section, button);
}

/* Modal */

let currentModalSection = null;

function openModal(section) {
    currentModalSection = section;
    const modal = document.getElementById('data-modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');

    modalTitle.textContent = `Agregar ${section}`;

    modalBody.innerHTML = getModalFields(section);
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('data-modal').classList.remove('active');
}

function submitModalData(e) {
    e.preventDefault();

    const form = e.target;
    const inputs = form.querySelectorAll('input');
    const payload = {};

    inputs.forEach(input => {
        payload[input.name] = input.value;
    });

    fetch(`${API_URL}/user/${currentModalSection}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        closeModal();
        loadProfileData();
    });
}

/* Helper */

function getModalFields(section) {
    if (section === 'address') {
        return `
            <input name="street" placeholder="Calle" required />
            <input name="city" placeholder="Ciudad" required />
            <input name="state" placeholder="Estado" required />
            <input name="zip" placeholder="Código Postal" required />
            <button type="submit">Guardar</button>
        `;
    }

    if (section === 'payment') {
        return `
            <input name="card_number" placeholder="Número de tarjeta" required />
            <input name="card_name" placeholder="Titular" required />
            <button type="submit">Guardar</button>
        `;
    }

    return '';
}

function formatLabel(text) {
    return text.replace(/_/g, ' ')
               .replace(/\b\w/g, l => l.toUpperCase());
}