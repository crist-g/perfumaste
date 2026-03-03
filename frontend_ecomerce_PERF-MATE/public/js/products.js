document.addEventListener('DOMContentLoaded', async () => {
    await cargarPerfumes('');
    const btn = document.getElementById('filter-btn');
    if (btn) {
        btn.addEventListener('click', applyFilters);
    }
});

async function cargarPerfumes(filtros) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/products${filtros}`);
        if (!response.ok) throw new Error('Error al cargar');
        
        const products = await response.json();
        const contenedor = document.getElementById('product-grid');
        const template = document.getElementById('product-template');
        
        if (filtros === '') updateDatalists(products);
        contenedor.innerHTML = ''; 

        if (products.length === 0) {
            contenedor.innerHTML = '<p class="no-results">No se encontraron perfumes.</p>';
            return;
        }

        products.forEach(p => {
            const clone = template.content.cloneNode(true);

            // Imagen
            const img = clone.querySelector('.p-image');
            img.src = p.image_url?.startsWith('/storage') 
                ? `http://127.0.0.1:8000${p.image_url}` 
                : (p.image_url || `https://placehold.co/400x400?text=${p.name}`);
            
            // Textos
            clone.querySelector('.p-name').textContent = p.name;
            const cat = p.category ? (typeof p.category === 'string' ? p.category : p.category.name) : '';
            clone.querySelector('.p-brand-category').textContent = `${p.brand} ${cat ? '• ' + cat : ''}`;
            clone.querySelector('.p-description').textContent = p.description || 'Sin descripción';
            clone.querySelector('.p-price').textContent = `$${p.price}`;
            clone.querySelector('.p-stock').textContent = `Stock: ${p.stock}`;

            // Enlace Detalle
            clone.querySelector('.p-link').href = `${window.BASE_PRODUCT_URL}/${p.id}`;

            // Cantidad
            const qtyInput = clone.querySelector('.p-qty');
            clone.querySelector('.p-minus').onclick = () => {
                if (qtyInput.value > 1) qtyInput.value--;
            };
            clone.querySelector('.p-plus').onclick = () => {
                if (parseInt(qtyInput.value) < p.stock) qtyInput.value++;
            };

            // Carrito
            clone.querySelector('.p-add-to-cart').onclick = () => {
                agregarAlCarrito(p.id, p.name, p.price, img.src, parseInt(qtyInput.value));
            };

            contenedor.appendChild(clone);
        });
    } catch (error) {
        console.error(error);
    }
}

function updateDatalists(products) {
    const bList = document.getElementById('brand-options');
    const cList = document.getElementById('category-options');
    
    if (bList) {
        const brands = [...new Set(products.map(p => p.brand))];
        bList.innerHTML = brands.map(b => `<option value="${b}">`).join('');
    }
    if (cList) {
        const cats = [...new Set(products.map(p => typeof p.category === 'string' ? p.category : p.category?.name).filter(Boolean))];
        cList.innerHTML = cats.map(c => `<option value="${c}">`).join('');
    }
}

window.applyFilters = function() {
    const s = document.getElementById('search').value;
    const b = document.getElementById('brand').value;
    const c = document.getElementById('category').value;
    const min = document.getElementById('min_price').value;
    const max = document.getElementById('max_price').value;

    let params = new URLSearchParams();
    if (s) params.append('search', s);
    if (b) params.append('brand', b);
    if (c) params.append('category', c);
    if (min) params.append('min_price', min);
    if (max) params.append('max_price', max);

    cargarPerfumes(`?${params.toString()}`);
};

window.agregarAlCarrito = async function(id, name, price, image, quantity) {
    const token = localStorage.getItem('api_token');
    if (!token) return alert("Inicia sesión primero.");

    try {
        const res = await fetch(`http://127.0.0.1:8000/api/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ product_id: id, quantity })
        });
        if (res.ok) alert(`¡${quantity}x ${name} añadido!`);
    } catch (e) { alert('Error al añadir'); }
};