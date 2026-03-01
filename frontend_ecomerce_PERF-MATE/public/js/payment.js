document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadUserData();
    initPayPal();

    const payBtn = document.getElementById('pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', processPayment);
    }
});

// CARRITO
function loadCart() {
    // Cambiar el nombre de la llave para usar perfume_cart
    const cart = JSON.parse(localStorage.getItem('perfume_cart')) || [];
    const container = document.getElementById('checkout-products');
    const totalEl = document.getElementById('checkout-total');

    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p>No hay productos en el carrito</p>';
        return;
    }

    cart.forEach(item => {
        total += item.price * item.quantity;

        const div = document.createElement('div');
        div.className = 'checkout-product';
        div.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>$${item.price * item.quantity}</span>
        `;
        container.appendChild(div);
    });

    totalEl.textContent = `$${total}`;
}

   //USUARIO / DIRECCIÓN / PAGO
function loadUserData() {

    /*
    🔗 ENDPOINT REAL
    GET /api/user/checkout-info
    */

    /*
    fetch(`${window.APP_CONFIG.apiUrl}/user/checkout-info`, {
        headers: {
            Authorization: 'Bearer TOKEN'
        }
    })
    .then(res => res.json())
    .then(data => {
        renderAddress(data.address);
        renderPayment(data.payment);
    });
    */

    // Mientras no hay API → no renderiza nada
}

function renderAddress(address) {
    const container = document.getElementById('checkout-address');
    container.innerHTML = '';

    Object.values(address).forEach(value => {
        const p = document.createElement('p');
        p.textContent = value;
        container.appendChild(p);
    });
}

function renderPayment(payment) {
    const container = document.getElementById('checkout-payment');
    container.innerHTML = '';

    Object.values(payment).forEach(value => {
        const p = document.createElement('p');
        p.textContent = value;
        container.appendChild(p);
    });
}

// Función para mostrar y configurar los botones de PayPal
function initPayPal() {
    const cart = JSON.parse(localStorage.getItem('perfume_cart')) || [];
    if (cart.length === 0) return;

    // Calcular total
    let totalCobro = 0;
    cart.forEach(item => totalCobro += (item.price * item.quantity));

    const container = document.getElementById('paypal-button-container');
    if (!container) return;

    paypal.Buttons({
        // Crear orden
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: totalCobro.toString() }
                }]
            });
        },
        //Aprobar pago
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Pasar ID real 
                processPayment(details.id); 
            });
        },
        onCancel: function (data) {
            alert("Cancelaste el pago.");
        }
    }).render('#paypal-button-container');
}

//PAGO
// Recibir el ID de transacción de PayPal como parámetro
async function processPayment(paypalTransaccionID) {
    const token = localStorage.getItem('api_token');
    // ver perfumes
    const cart = JSON.parse(localStorage.getItem('perfume_cart')) || [];

    if (!token) {
        alert('Debes iniciar sesión para poder pagar.');
        window.location.href = '/login';
        return;
    }

    if (cart.length === 0) {
        alert('No hay nada que cobrar. Tu carrito está vacío.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                payment_id: paypalTransaccionID,
                // Mandar los perfumes actuales para que el back reste stock
                items: cart 
            })
        });

        const data = await response.json();

        if (response.status === 201 || response.ok) {
            
            // Limpiar el almacenamiento local al terminar de pagar
            localStorage.removeItem('perfume_cart'); 
            
            // Mandar a la vista del ticket con el ID de orden que devolvió el servidor
            window.location.href = `/ticket?order=${data.order_id}`;
        } else {
            alert('Hubo un error con la compra: ' + (data.message || 'Error desconocido'));
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor 8000.');
    }
}