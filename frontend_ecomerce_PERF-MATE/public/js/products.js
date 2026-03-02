document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    document.getElementById('filter-btn')
        .addEventListener('click', applyFilters);
});

async function loadProducts(filters = '') {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/products${filters}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    if (!products.length) {
        grid.innerHTML = '<p style="color:gray">No se encontraron productos.</p>';
        return;
    }

    products.forEach(p => {
        const image = resolveImage(p);

        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <img src="${image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <div class="brand">${p.brand}</div>

            <div class="description">
                ${p.description ? truncate(p.description, 80) : 'Sin descripción disponible'}
            </div>

            <div class="price">$${p.price}</div>

            <div class="product-actions">
                <button class="btn-details" onclick="verDetalles(${p.id})">
                    Detalles
                </button>
                <button class="btn-cart" onclick="addToCart(${p.id}, '${p.name}', ${p.price}, '${image}')">
                    Agregar
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function resolveImage(p) {
    if (!p.image_url) {
        return `https://placehold.co/400x400?text=${encodeURIComponent(p.name)}`;
    }

    if (p.image_url.startsWith('/storage')) {
        return `http://127.0.0.1:8000${p.image_url}`;
    }

    return p.image_url;
}

function truncate(text, length) {
    return text.length > length ? text.substring(0, length) + '…' : text;
}

// FILTROS
function applyFilters() {
    const search = document.getElementById('search').value;
    const min = document.getElementById('min_price').value;
    const max = document.getElementById('max_price').value;

    let query = '?';
    if (search) query += `search=${encodeURIComponent(search)}&`;
    if (min) query += `min_price=${min}&`;
    if (max) query += `max_price=${max}&`;

    loadProducts(query);
}

// CARRITO
window.addToCart = function(id, name, price, image) {
    const cart = JSON.parse(localStorage.getItem('perfume_cart')) || [];
    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    localStorage.setItem('perfume_cart', JSON.stringify(cart));
    alert(`🛒 ${name} agregado al carrito`);
};

window.verDetalles = function(id) {
    // Ruta preparada para vista de detalle
    window.location.href = `/products/${id}`;
};