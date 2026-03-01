document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            enableEdit(section, btn);
        });
    });
});

function loadProfileData() {

    /*
    🔗 ENDPOINT REAL
    GET /api/user/profile
    */

    /*
    fetch(`${window.APP_CONFIG.apiUrl}/user/profile`, {
        headers: {
            Authorization: 'Bearer TU_TOKEN'
        }
    })
    .then(res => res.json())
    .then(data => renderProfile(data));
    */

    // 🔴 Mientras no exista API, NO renderiza nada
}

function renderProfile(data) {

    renderSection('personal', data.personal);
    renderSection('address', data.address);
    renderSection('payment', data.payment);
}

function renderSection(section, fields) {
    const container = document.getElementById(`${section}-info`);
    container.innerHTML = '';

    if (!fields) return;

    Object.entries(fields).forEach(([key, value]) => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${key}:</strong> <span data-field="${key}">${value}</span>`;
        container.appendChild(p);
    });
}

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

    button.textContent = 'Editar';
    button.onclick = () => enableEdit(section, button);

    /*
    🔗 ENDPOINT REAL
    PUT /api/user/{section}
    */

    /*
    fetch(`${window.APP_CONFIG.apiUrl}/user/${section}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer TU_TOKEN'
        },
        body: JSON.stringify(payload)
    })
    */
}