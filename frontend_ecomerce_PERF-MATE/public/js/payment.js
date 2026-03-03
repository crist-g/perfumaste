document.addEventListener('DOMContentLoaded', () => {
    // sólo ejecutar funciones cuando los elementos existan
    if (document.getElementById('checkout-products')) {
        loadCheckoutCart();
    }

    if (document.getElementById('paypal-button-container')) {
        initPayPal();
    }

    loadUserData();

    const payBtn = document.getElementById('pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', processPayment);
    }
});

// CARRITO
async function fetchServerCart() {
    const token = localStorage.getItem('api_token');
    if (!token) return [];

    const url = `${window.APP_CONFIG.apiUrl}/cart`;

    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.items || [];
    } catch (err) {
        console.error('Error fetching cart from server:', err);
        return [];
    }
}

async function loadCheckoutCart() {
    const container = document.getElementById('checkout-products');
    const totalEl = document.getElementById('checkout-total');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    const cart = await fetchServerCart();
    if (cart.length === 0) {
        container.innerHTML = '<p>No hay productos en el carrito</p>';
        return;
    }

    cart.forEach(item => {
        const price = item.product?.price || item.price;
        const name = item.product?.name || item.name;
        total += price * item.quantity;

        const div = document.createElement('div');
        div.className = 'checkout-product';
        div.innerHTML = `
            <span>${name} x${item.quantity}</span>
            <span>$${price * item.quantity}</span>
        `;
        container.appendChild(div);
    });

    totalEl.textContent = `$${total}`;
}

   //USUARIO / DIRECCIÓN 
async function loadUserData() {
    const token = localStorage.getItem('api_token');
    if (!token) return;

    try {
        const res = await fetch(`${window.APP_CONFIG.apiUrl}/user`, {
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Accept': 'application/json' 
            }
        });
        
        const data = await res.json();
        const addressContainer = document.querySelector('.Dirección-de-envío-container'); 

        const addressDiv = document.getElementById('checkout-address'); 
        
        if (data.address && addressDiv) {
            addressDiv.innerHTML = `
                <p style="margin: 5px 0;"><strong>Calle:</strong> ${data.address.street || ''}</p>
                <p style="margin: 5px 0;"><strong>Ciudad:</strong> ${data.address.city || ''}</p>
                <p style="margin: 5px 0;"><strong>Estado:</strong> ${data.address.state || ''}</p>
                <p style="margin: 5px 0;"><strong>C.P.:</strong> ${data.address.zip || ''}</p>
            `;
        } else if (addressDiv) {
            addressDiv.innerHTML = '<p style="color:#d84315; font-size: 14px;"> Ve a tu perfil y agrega una dirección de envío antes de pagar.</p>';
        }
        
    } catch (e) {
        console.error('Error cargando dirección:', e);
    }
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
async function initPayPal() {
    const cart = await fetchServerCart();
    if (cart.length === 0) return;

    // Calcular total
    let totalCobro = 0;
    cart.forEach(item => {
        const price = item.product?.price || item.price;
        totalCobro += price * item.quantity;
    });

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
                processPayment(details.id); 
            });
        },
        onCancel: function (data) {
            alert("Cancelaste el pago.");
        }
    }).render('#paypal-button-container');
}

// PAGO
// Recibir el ID de transacción de PayPal como parámetro
async function processPayment(paypalTransaccionID) {
    const token = localStorage.getItem('api_token');
    if (!token) {
        alert('Debes iniciar sesión para poder pagar.');
        window.location.href = '/login';
        return;
    }

    // traer los items directamente del servidor
    const cart = await fetchServerCart();

    if (cart.length === 0) {
        alert('No hay nada que cobrar. Tu carrito está vacío.');
        return;
    }

    const payloadItems = cart.map(item => ({
        id: item.product?.id || item.id,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        quantity: item.quantity
    }));

    try {
        const response = await fetch(`${window.APP_CONFIG?.apiUrl || 'http://127.0.0.1:8000/api'}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                payment_id: paypalTransaccionID,
                items: payloadItems
            })
        });

        const data = await response.json();

        if (response.status === 201 || response.ok) {
            window.location.href = `/ticket?order=${data.order_id}`;
        } else {
            alert('Hubo un error con la compra: ' + (data.message || 'Error desconocido'));
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor.');
    }
}