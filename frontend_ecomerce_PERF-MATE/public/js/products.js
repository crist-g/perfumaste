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
        if (!response.ok) {
            console.error('fetch falló', response.status, response.statusText);
            document.getElementById('product-grid').innerHTML = '<p style="color:red; text-align:center;">Error cargando productos (HTTP ' + response.status + ').</p>';
            return [];
        }
        const products = await response.json();
        
        // Menu (llenar datalists)
        if (filtros === '') { 
            const datalistMarca = document.getElementById('brand-options'); 
            if (datalistMarca) {
                const marcasUnicas = [...new Set(products.map(p => p.brand))];
                datalistMarca.innerHTML = ''; // Limpiar lista
                marcasUnicas.forEach(marca => {
                    datalistMarca.innerHTML += `<option value="${marca}">`;
                });
            }

            const datalistCat = document.getElementById('category-options');
            if (datalistCat) {
                const categorias = [...new Set(products.map(p => {
                    if (!p.category) return null;
                    return typeof p.category === 'string' ? p.category : p.category.name;
                }).filter(c=>c))];
                datalistCat.innerHTML = '';
                categorias.forEach(cat => {
                    datalistCat.innerHTML += `<option value="${cat}">`;
                });
            }
        }

        let contenedor = document.getElementById('product-grid');
        contenedor.innerHTML = ''; 

        if (products.length === 0) {
            contenedor.innerHTML = '<p style="width: 100%; text-align: center; color: gray;">No se encontraron perfumes.</p>';
            return;
        }

        products.forEach(p => {
            let imagen = `https://placehold.co/400x400/000000/FFF?text=${encodeURIComponent(p.name)}`;
            
            if (p.image_url) {
                if (p.image_url.includes('via.placehold.co')) {
                    imagen = `https://placehold.co/400x400/000000/FFF?text=${encodeURIComponent(p.name)}`;
                } else if (p.image_url.startsWith('/storage')) {
                    imagen = `http://127.0.0.1:8000${p.image_url}`;
                } else {
                    imagen = p.image_url;
                }
            }
            
                    const categoryText = p.category ? (typeof p.category === 'string' ? p.category : p.category.name || '') : '';

                    contenedor.innerHTML += `
                        <div style="border: 1px solid #ccc; padding: 15px; width: 200px; text-align: center; border-radius: 8px; background: white;">
                            <img src="${imagen}" alt="${p.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
                            <h3 style="margin: 0;">${p.name}</h3>
                            <p style="color: gray; margin: 5px 0;">${p.brand}${categoryText ? ' • ' + categoryText : ''}</p>
                            <p style="font-size: 0.85rem; color: #555; margin: 10px 0; line-height:1.4;">${p.description ? p.description : 'Sin descripción disponible'}</p>
                            <h2 style="margin: 10px 0;">$${p.price}</h2>
                            <p style="font-size: 12px;">Stock: ${p.stock}</p>
                            
                            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px; gap: 10px;">
                                <button onclick="cambiarCantidadHome(${p.id}, -1)" style="padding: 5px 10px; border: 1px solid #ccc; background: #eee; cursor:pointer; border-radius: 4px;">-</button>
                                <input type="number" id="qty-${p.id}" value="1" readonly style="width: 40px; text-align: center; border: 1px solid #ccc; border-radius: 4px; padding: 4px;">
                                <button onclick="cambiarCantidadHome(${p.id}, 1, ${p.stock})" style="padding: 5px 10px; border: 1px solid #ccc; background: #eee; cursor:pointer; border-radius: 4px;">+</button>
                            </div>

                            <button onclick="agregarAlCarrito(${p.id}, '${p.name}', ${p.price}, '${imagen}')" style="background: black; color: white; padding: 8px; width: 100%; cursor:pointer; border:none; border-radius: 4px;">
                                Añadir al carrito
                            </button>
                        </div>
                    `;
        });
    } catch (error) {
        console.error('Error cargando perfumes:', error);
    }
}

// ajustar cantidad en el listado de productos
window.cambiarCantidadHome = function(id, delta, stock = Infinity) {
    const input = document.getElementById(`qty-${id}`);
    if (!input) return;
    let val = parseInt(input.value) || 1;
    val += delta;
    if (val < 1) val = 1;
    if (val > stock) val = stock;
    input.value = val;
};

// Filtrado con nombres
window.applyFilters = function() {
    const search = document.getElementById('search').value;
    const brand = document.getElementById('brand').value;
    const category = document.getElementById('category').value;
    const minPrice = document.getElementById('min_price').value;
    const maxPrice = document.getElementById('max_price').value;

    let filtros = '?';
    if (search) filtros += `search=${encodeURIComponent(search)}&`;
    if (brand) filtros += `brand=${encodeURIComponent(brand)}&`;
    if (category) filtros += `category=${encodeURIComponent(category)}&`;
    if (minPrice) filtros += `min_price=${minPrice}&`;
    if (maxPrice) filtros += `max_price=${maxPrice}&`; 

    cargarPerfumes(filtros);
};


window.agregarAlCarrito = async function(id, name, price, image) {
    const quantity = parseInt(document.getElementById(`qty-${id}`)?.value) || 1;
    const token = localStorage.getItem('api_token'); // Necesitas estar logueado

    if (!token) {
        alert("Primero debes iniciar sesión para añadir perfumes.");
        return;
    }

    const apiUrl = window.APP_CONFIG?.apiUrl || 'http://127.0.0.1:8000/api';

    try {
        const response = await fetch(`${apiUrl}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                product_id: id,
                quantity: quantity
            })
        });

        if (response.ok) {
            alert(`¡Servidor: Se añadieron ${quantity}x ${name} al carrito!`);
        } else {
            const error = await response.json().catch(() => ({}));
            alert(`Error: ${error.message || 'No se pudo añadir al carrito'}`);
        }
    } catch (err) {
        console.error("Error en la conexión con el servidor:", err);
        alert('Error de conexión. Revisa la consola.');
    }
};