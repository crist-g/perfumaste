document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('orders-table')) {
        loadOrders();
    }
});

async function loadOrders() {
    try {
        /*
        ENDPOINT REAL
        GET /api/admin/orders
        */

        const response = await fetch('http://127.0.0.1:8000/api/admin/orders', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('api_token')}`
            }
        });

        const orders = await response.json();
        renderOrders(orders);

    } catch (error) {
        console.error('Error cargando pedidos:', error);
    }
}

/* renderizar tabla */
function renderOrders(orders) {
    const tbody = document.getElementById('orders-table');
    tbody.innerHTML = '';

    orders.forEach(order => {
        const tr = document.createElement('tr');
        
        // Intentar obtener información del usuario de múltiples formas
        let userDisplay = 'Sin usuario';
        
        // Caso 1: usuario tiene propiedades name/email en el mismo objeto
        if (order.user_name || order.user_email) {
            userDisplay = order.user_name ? 
                `${order.user_name} (${order.user_email})` : 
                order.user_email;
        }
        // Caso 2: usuario anidado en objeto 'user'
        else if (order.user && typeof order.user === 'object') {
            const name = order.user.name || order.user.email;
            const email = order.user.email;
            if (name && email && name !== email) {
                userDisplay = `${name} (${email})`;
            } else {
                userDisplay = name || 'Sin usuario';
            }
        }

        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${userDisplay}</td>
            <td>$${order.total}</td>
            <td class="status-${order.status}">
                ${formatStatus(order.status)}
            </td>
            <td>
                <select class="status-select"
                    onchange="updateOrderStatus(${order.id}, this.value)">
                    ${renderStatusOptions(order.status)}
                </select>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

/* Estados */
function renderStatusOptions(current) {
    const statuses = ['confirmado', 'enviado', 'reparto', 'entregado'];

    return statuses.map(status =>
        `<option value="${status}" ${status === current ? 'selected' : ''}>
            ${formatStatus(status)}
        </option>`
    ).join('');
}

function formatStatus(status) {
    const map = {
        confirmado: 'Confirmado',
        enviado: 'Enviado',
        reparto: 'En reparto',
        entregado: 'Entregado'
    };
    return map[status] || status;
}


async function updateOrderStatus(orderId, status) {
    try {
        /*
        🔗 ENDPOINT REAL
        PUT /api/admin/orders/{id}/status
        */

        await fetch(`http://127.0.0.1:8000/api/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('api_token')}`
            },
            body: JSON.stringify({ status })
        });

        alert('Estado actualizado');

    } catch (error) {
        console.error('Error actualizando estado:', error);
        alert('No se pudo actualizar el pedido');
    }
}