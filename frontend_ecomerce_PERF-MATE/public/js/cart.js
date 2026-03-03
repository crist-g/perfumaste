// Preferred API bases to try (first is from config, second is legacy default)
const CART_API_BASES = [window.APP_CONFIG?.apiUrl || 'http://127.0.0.1:8000/api', 'http://127.0.0.1:8000/api'];

// helper that tries the configured bases in order and returns the first successful response
async function cartFetch(path, options = {}) {
    for (const base of CART_API_BASES) {
        try {
            const res = await fetch(base + path, options);
            if (res.ok) return res;
            // If 404, try next base; if other 4xx/5xx, return it so caller can handle
            if (res.status === 404) continue;
            return res;
        } catch (err) {
            // network error -> try next base
            console.warn('cartFetch base failed', base, err);
            continue;
        }
    }
    // if we get here, none succeeded
    throw new Error('No API base responded');
}

document.addEventListener('DOMContentLoaded', () => {
    // solo correr si la página muestra el contenedor del carrito
    if (document.getElementById('cart-items')) {
        loadCart();
    }
});

async function loadCart() {
    const token = localStorage.getItem('api_token');
    
    if (!token) {
        document.getElementById('cart-items').innerHTML = '<p style="text-align:center; color: gray;">Inicia sesión para ver tu carrito.</p>';
        return;
    }

    try {
        const response = await cartFetch('/cart', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });


        if (response.ok) {
            const data = await response.json();
            renderCart(data.items, data.total_to_pay); 
        } else {
            const errorData = await response.json().catch(()=>({message: 'Unknown error'}));
            console.error("ERROR DEL SERVIDOR:", errorData);
            document.getElementById('cart-items').innerHTML = `<p style="color:red; text-align:center; padding: 20px;">Error: ${errorData.message || response.status}</p>`;
        }
    } catch (error) {
        console.error('Error cargando carrito desde el servidor:', error);
        document.getElementById('cart-items').innerHTML = '<p style="color:red; text-align:center;">No se pudo conectar con el servidor del carrito.</p>';
    }
}

function renderCart(items, total) {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (!container || !totalEl) return;
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 20px; color: gray;">Tu carrito está vacío en el servidor. ¡Agrega unas buenas fragancias!</p>';
        totalEl.textContent = '0.00';
        return;
    }

    items.forEach(item => {
        // Validar imagen y normalizar URL de placehold
        let imagen = item.product.image_url || '';
        if (imagen.includes('placehold.co')) {
            imagen = `https://placehold.co/400x400/000000/FFF?text=${encodeURIComponent(item.product.name)}`;
        } else if (imagen.startsWith('/storage')) {
            imagen = `http://127.0.0.1:8000${imagen}`;
        } else if (!imagen) {
            imagen = `https://placehold.co/400x400/000000/FFF?text=${encodeURIComponent(item.product.name)}`;
        }

        container.innerHTML += `
            <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${imagen}" alt="${item.product.name}" onerror="this.onerror=null;this.src='https://placehold.co/400x400/000000/FFF?text=${encodeURIComponent(item.product.name)}'" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                    <div class="info">
                        <h4 style="margin: 0;">${item.product.name}</h4>
                        <p style="margin: 5px 0; color: gray;">$${item.product.price} c/u</p>
                    </div>
                </div>
                <div class="quantity" style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="changeQuantityServidor(${item.id}, ${item.quantity - 1})" style="padding: 5px 10px;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantityServidor(${item.id}, ${item.quantity + 1})" style="padding: 5px 10px;">+</button>
                </div>
                <button onclick="removeItemServidor(${item.id})" style="background: transparent; border: none; color: red; font-size: 20px; cursor: pointer;" title="Eliminar">✕</button>
            </div>
        `;
    });

    totalEl.textContent = parseFloat(total).toFixed(2);
}

// Actualizar cantidad
window.changeQuantityServidor = async function(cartItemId, newQuantity) {
    if (newQuantity < 1) return; // No permitir menos de 1
    
    const token = localStorage.getItem('api_token');
    try {
        await cartFetch(`/cart/${cartItemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ quantity: newQuantity })
        });
        loadCart(); // Recargar el carrito para ver el nuevo total
    } catch (error) {
        console.error('Error al actualizar cantidad', error);
    }
}

// Eliminar item del carrito
window.removeItemServidor = async function(cartItemId) {
    if (!confirm('¿Seguro que deseas sacar este perfume del carrito?')) return;

    const token = localStorage.getItem('api_token');
    try {
        await cartFetch(`/cart/${cartItemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        loadCart(); // Recargar el carrito para que desaparezca
    } catch (error) {
        console.error('Error al eliminar item', error);
    }
}