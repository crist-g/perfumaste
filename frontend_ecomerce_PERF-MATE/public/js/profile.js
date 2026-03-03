document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.profile-container')) return; 
    
    loadProfileData();
    loadOrders();

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const section = btn.dataset.section;
            const container = document.getElementById(`${section}-info`);

            if (container && container.querySelector('.empty-data')) {
                profileOpenModal(section);
                return;
            }

            // Leemos qué dice el botón para saber qué acción tomar
            if (btn.textContent.trim() === 'Guardar') {
                saveSection(section, btn);
            } else {
                enableEdit(section, btn);
            }
        };
    });

    const modalForm = document.getElementById('modal-form');
    if (modalForm) modalForm.addEventListener('submit', submitModalData);
});

/* Configuración de API */
const API_URL = window.APP_CONFIG?.apiUrl || 'http://127.0.0.1:8000/api';
const TOKEN = localStorage.getItem('api_token');

async function profileFetch(path, options = {}) {
    return fetch(API_URL + path, options);
}

function loadProfileData() {
    profileFetch('/user', { headers: { 'Authorization': `Bearer ${TOKEN}`, 'Accept': 'application/json' } })
    .then(res => res.json())
    .then(data => renderProfile(data))
    .catch(err => console.error('Error cargando perfil:', err));
}

function renderProfile(data) {
    renderSection('personal', { name: data.name, email: data.email });
    if (data.address) renderSection('address', data.address);
    else renderEmptySection('address');
}

function renderSection(section, fields) {
    const container = document.getElementById(`${section}-info`);
    container.innerHTML = '';
    Object.entries(fields).forEach(([key, value]) => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${formatLabel(key)}:</strong> <span data-field="${key}">${value ?? '-'}</span>`;
        container.appendChild(p);
    });
}

function renderEmptySection(section) {
    const container = document.getElementById(`${section}-info`);
    container.innerHTML = `<p class="empty-data">No hay información registrada</p>
                           <button class="add-btn" onclick="profileOpenModal('${section}')">Agregar información</button>`;
}

/* EDITAR Y GUARDAR*/
function enableEdit(section, button) {
    const container = document.getElementById(`${section}-info`);
    const spans = container.querySelectorAll('span[data-field]');

    spans.forEach(span => {
        const input = document.createElement('input');
        input.className = 'input-edit';
        input.value = span.textContent !== '-' ? span.textContent : '';
        input.setAttribute('data-field', span.getAttribute('data-field'));
        span.replaceWith(input);
    });

    button.textContent = 'Guardar'; 
}

async function saveSection(section, button) {
    const container = document.getElementById(`${section}-info`);
    const inputs = container.querySelectorAll('input');
    const payload = {};

    inputs.forEach(input => {
        const fieldName = input.getAttribute('data-field');
        payload[fieldName] = input.value;
    });

    try {
        const res = await profileFetch(`/user/${section}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            if (res.status === 422) {
                let msgErrores = '';
                for (let campo in err.errors) msgErrores += err.errors[campo][0] + '\n';
                alert(`Datos inválidos:\n${msgErrores}`);
            } else {
                alert(`No se pudo guardar: ${err.message || res.status}`);
            }
            return;
        }

        inputs.forEach(input => {
            const span = document.createElement('span');
            span.setAttribute('data-field', input.getAttribute('data-field'));
            span.textContent = input.value || '-';
            input.replaceWith(span);
        });

        button.textContent = 'Editar';
        
        if (section === 'personal') {
            localStorage.setItem('user_name', payload.name); 
            window.location.reload();
        }

    } catch (error) {
        console.error('Error guardando', error);
        alert('Error de red al guardar.');
    }
}

/* Modal */

let currentModalSection = null;

function profileOpenModal(section) {
    currentModalSection = section;
    const modal = document.getElementById('data-modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');

    modalTitle.textContent = `Agregar ${section}`;

    modalBody.innerHTML = getModalFields(section);
    modal.classList.remove('hidden');
}


function profileCloseModal() {
    currentModalSection = null;
    const modal = document.getElementById('data-modal');
    if (modal) modal.classList.add('hidden');
}

function submitModalData(e) {
    e.preventDefault();

    if (!currentModalSection) return; // nada que hacer si no hay sección

    const form = e.target;
    const inputs = form.querySelectorAll('input');
    const payload = {};

    inputs.forEach(input => {
        payload[input.name] = input.value;
    });

    profileFetch(`/user/${currentModalSection}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        profileCloseModal();
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
        `;
    }

    if (section === 'payment') {
        return `
            <input name="card_number" placeholder="Número de tarjeta" required />
            <input name="card_name" placeholder="Titular" required />
        `;
    }

    return '';
}

function formatLabel(text) {
    return text.replace(/_/g, ' ')
               .replace(/\b\w/g, l => l.toUpperCase());
}

/* PEDIDOS DEL USUARIO */


function loadOrders() {
    profileFetch('/orders', { 
        // 👉 ENDPOINT REAL:
        // GET /api/orders (del usuario autenticado)
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Accept': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) throw new Error('HTTP '+res.status);
        return res.json();
    })
    .then(data => renderOrders(data))
    .catch((err) => {
        console.warn('Error cargando pedidos', err);
        document.getElementById('orders-info').innerHTML =
            `<p class="empty-data">No se pudieron cargar los pedidos</p>`;
    });
}

function renderOrders(orders) {
    const container = document.getElementById('orders-info');
    container.innerHTML = '';

    if (!orders || orders.length === 0) {
        container.innerHTML = `<p class="empty-data">Aún no has realizado pedidos</p>`;
        return;
    }

    orders.forEach(order => {
        const div = document.createElement('div');
        div.className = 'order-item';

        const totalFrascos = order.items ? order.items.reduce((suma, item) => suma + item.quantity, 0) : 0;

        div.innerHTML = `
            <div class="order-header">
                <span class="order-id">Pedido #${order.id}</span>
                <span class="order-status status-${order.status}">
                    ${formatStatus(order.status)}
                </span>
            </div>
            <div class="order-meta">
                <span>${totalFrascos} productos</span>
                <span>Total: $${order.total}</span>
            </div>
            <div class="order-date">
                ${new Date(order.created_at).toLocaleDateString()}
            </div>
        `;
        container.appendChild(div);
    });
}

function formatStatus(status) {
    const map = {
        confirmed: 'Confirmado',
        shipped: 'Enviado',
        delivering: 'En reparto',
        delivered: 'Entregado'
    };
    return map[status] || status;
}