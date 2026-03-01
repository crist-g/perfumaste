
let currentPage = 1;

// INIT

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

async function loadProducts(page = 1) {
    currentPage = page;

    const params = new URLSearchParams({
        search: document.getElementById('search')?.value || '',
        brand: document.getElementById('brand')?.value || '',
        min_price: document.getElementById('min_price')?.value || '',
        max_price: document.getElementById('max_price')?.value || '',
        page
    });

    try {
        const res = await fetch(`${window.APP_CONFIG.apiUrl}/products?${params}`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        renderProducts(data.data);
        renderPagination(data.meta);

    } catch {
        console.warn('API no disponible, usando mock');
        const mock = getMockProducts();
        renderProducts(mock.data);
        renderPagination(mock.meta);
    }
}

//FILTERS

function applyFilters() {
    loadProducts(1);
}

// RENDER PRODUCTS

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    if (!products.length) {
        grid.innerHTML = '<p>No se encontraron productos</p>';
        return;
    }

    products.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${p.image}">
                <h3>${p.name}</h3>
                <p>$${p.price} MXN</p>
                <a href="/productos/${p.id}" class="btn">Ver detalles</a>
            </div>
        `;
    });
}

// PAGINATION

function renderPagination(meta) {
    const pag = document.getElementById('pagination');
    pag.innerHTML = '';

    for (let i = 1; i <= meta.last_page; i++) {
        pag.innerHTML += `
            <button 
                class="page-btn ${i === meta.current_page ? 'active' : ''}"
                onclick="loadProducts(${i})">
                ${i}
            </button>
        `;
    }
}

// ==============================
// MOCK TEMPORAL
// ==============================
function getMockProducts() {
    return {
        data: [
            { id: 1, name: 'Dior Sauvage', price: 2300, image: 'https://via.placehold.co/200' },
            { id: 2, name: 'Versace Eros', price: 1950, image: 'https://via.placehold.co/200' },
            { id: 3, name: 'Bleu de Chanel', price: 2500, image: 'https://via.placehold.co/200' }
        ],
        meta: {
            current_page: currentPage,
            last_page: 3
        }
    };
}