// Llave para identificar el carrito en el almacenamiento local del navegador
const CART_KEY = 'perfume_cart';

// Obtener la lista de productos guardados o un arreglo vacío si no hay nada
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Guardar el estado actual del carrito en LocalStorage convirtiéndolo a texto JSON
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

//INTERACCIÓN CON API
// Sincronizar un producto con la base de datos de la cuenta de usuario
window.addProductFromApi = async function(productId) {
    try {
        // Recuperar token de sesión para autorizar la petición
        const token = localStorage.getItem('api_token'); 

        if (!token) {
            alert('Por favor, inicia sesión para agregar al carrito.');
            window.location.href = '/login';
            return;
        }

        const response = await fetch('http://127.0.0.1:8000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` // Autenticación mediante Sanctum
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        });

        if (response.status === 201 || response.ok) {
            alert('¡Producto guardado en tu base de datos!');
        } else {
            alert('Error al agregar producto. Revisa tu consola.');
        }

    } catch (error) {
        console.error('Error conectando con tu API:', error);
    }
}

// LÓGICA DEL CARRITO
window.changequantity = function(index, amount) {
    const cart = getCart();
    let nuevaCantidad = cart[index].quantity + amount;

    if (nuevaCantidad >= 1) {
        cart[index].quantity = nuevaCantidad;
        saveCart(cart);
        renderCart();
    }
}

// Eliminar un producto
window.removeItem = function(index) {
    if(confirm('¿Seguro que deseas sacar este perfume del carrito?')) {
        const cart = getCart();
        cart.splice(index, 1); // Quitar elemento del índice seleccionado
        saveCart(cart);
        renderCart();
    }
}

// DATOS: INTERFAZ DE USUARIO (RENDER)
// Mostrar los productos en la vista del carrito
window.renderCart = function() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    // Verificar que los elementos existan en el DOM antes de intentar dibujar
    if (!container || !totalEl) return;

    const cart = getCart();
    container.innerHTML = '';
    let total = 0;

    // Mostrar mensaje si no hay productos seleccionados
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 20px; color: gray;">Tu carrito está vacío. ¡Agrega unas buenas fragancias!</p>';
        totalEl.textContent = '0.00';
        return;
    }

    // Recorrer el carrito para calcular el total y construir las filas de productos
    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        // Inyectar HTML para mostrar datos del producto
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" style="width: 80px; border-radius: 8px;">
                <div class="info">
                    <h4>${item.name}</h4>
                    <p>$${item.price} c/u</p>
                </div>
                <div class="quantity">
                    <button onclick="changequantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changequantity(${index}, 1)">+</button>
                </div>
                <button onclick="removeItem(${index})" style="background: transparent; border: none; color: red; font-size: 20px; cursor: pointer;" title="Eliminar">✕</button>
            </div>
        `;
    });

    // Mostrar el total final con dos decimales
    totalEl.textContent = total.toFixed(2);
}

// Iniciar el renderizado automático una vez que el navegador termine de cargar el HTML
document.addEventListener('DOMContentLoaded', renderCart);