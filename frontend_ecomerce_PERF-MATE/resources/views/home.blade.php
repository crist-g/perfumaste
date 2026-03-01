@extends('layouts.app')

@section('content')

<section class="hero">
    <h1>Encuentra tu fragancia ideal</h1>
    <p>Los mejores aromas al mejor precio</p>
</section>

{{-- FILTROS --}}
<section class="filters">
    <input type="text" id="search" placeholder="Buscar perfume">

    <select id="brand">
        <option value="">Todas las marcas</option>
    </select>

    <input type="number" id="min_price" placeholder="Precio mínimo" min="0">
    <input type="number" id="max_price" placeholder="Precio máximo" min="0" max="10000">

    <button class="btn" onclick="applyFilters()">Filtrar</button>
</section>

{{-- PRODUCTOS --}}
<section class="products">
    <h2>Perfumes</h2>

    <div id="product-grid" class="product-grid"></div>

    {{-- PAGINACIÓN --}}
    <div id="pagination" class="pagination"></div>
</section>

<script>
document.addEventListener('DOMContentLoaded', async () => {
    await cargarPerfumes(''); 
});

// CARGA DE PRODUCTOS
async function cargarPerfumes(filtros) {
    try {
        // Pedir los productos al servidor 
        const response = await fetch(`http://127.0.0.1:8000/api/products${filtros}`);
        const products = await response.json();
        
        // Llenar el menú de marcas on las de la bd
        if (filtros === '') { 
            const selectMarca = document.getElementById('brand'); 
            if (selectMarca) {
                const marcasUnicas = [...new Set(products.map(p => p.brand))];
                selectMarca.innerHTML = '<option value="">Todas las marcas</option>';
                marcasUnicas.forEach(marca => {
                    selectMarca.innerHTML += `<option value="${marca}">${marca}</option>`;
                });
            }
        }

        // Crear el contenedor falla el HTML 
        let contenedor = document.querySelector('.product-grid');
        if(!contenedor){
            contenedor = document.createElement('div');
            contenedor.className = 'products-grid';
            contenedor.style.display = 'flex';
            contenedor.style.gap = '20px';
            contenedor.style.flexWrap = 'wrap';
            contenedor.style.padding = '20px';
            document.body.appendChild(contenedor);
        }

        contenedor.innerHTML = ''; 

        // Mostrar aviso si la búsqueda no arroja resultados
        if (products.length === 0) {
            contenedor.innerHTML = '<p style="width: 100%; text-align: center; color: gray;">No se encontraron perfumes con esos filtros.</p>';
            return;
        }

        // Dibujar cada tarjeta de perfume con su información
        products.forEach(p => {
            let imagen = `https://placehold.co/400x400/000000/FFF?text=${encodeURIComponent(p.name)}`;
            
            // Validar el origen de la imagen para que no se rompa el diseño
            if (p.image_url) {
                if (p.image_url.includes('via.placehold.co')) {
                    imagen = `https://placehold.co/400x400/000000/FFF?text=${encodeURIComponent(p.name)}`;
                } else if (p.image_url.startsWith('/storage')) {
                    // Usar la ruta del backend si la imagen se subió desde la computadora
                    imagen = `http://127.0.0.1:8000${p.image_url}`;
                } else {
                    imagen = p.image_url;
                }
            }
            
            // Inyectar el bloque del producto con su selector de cantidad
            contenedor.innerHTML += `
                <div style="border: 1px solid #ccc; padding: 15px; width: 200px; text-align: center; border-radius: 8px; background: white;">
                    <img src="${imagen}" alt="${p.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
                    <h3 style="margin: 0;">${p.name}</h3>
                    <p style="color: gray; margin: 5px 0;">${p.brand}</p>
                    <h2 style="margin: 10px 0;">$${p.price}</h2>
                    <p style="font-size: 12px;">Stock disponible: ${p.stock}</p>
                    
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

// FILTRADO
window.applyFilters = function() {
    // Leer los valores de los cuadros de texto y del menú desplegable
    const brand = document.getElementById('brand').value;
    const minPrice = document.getElementById('min_price').value;
    const maxPrice = document.getElementById('max_price').value;

    // Armar la cadena de texto para la consulta a la API
    let filtros = '?';
    if (brand) filtros += `brand=${encodeURIComponent(brand)}&`;
    if (minPrice) filtros += `min_price=${minPrice}&`;
    if (maxPrice) filtros += `max_price=${maxPrice}&`; 

    cargarPerfumes(filtros);
};

// CARRITO
window.agregarAlCarrito = function(id, name, price, image) {
    // Piezas que quiere el usuario antes de guardar
    const cantidadSeleccionada = parseInt(document.getElementById(`qty-${id}`).value) || 1;
    const cart = JSON.parse(localStorage.getItem('perfume_cart')) || [];
    const existing = cart.find(p => p.id === id);

    // Si el perfume ya estaba, solo sumar la cantidad nueva
    if (existing) {
        existing.quantity += cantidadSeleccionada;
    } else {
        cart.push({ id, name, price, image, quantity: cantidadSeleccionada });
    }

    // Actualizar el almacenamiento local y avisar al usuario
    localStorage.setItem('perfume_cart', JSON.stringify(cart));
    alert(`¡Se agregaron ${cantidadSeleccionada}x ${name} al carrito!`);
    
    // Reiniciar el contador a 1
    document.getElementById(`qty-${id}`).value = 1;
};

// "+" O "-" EN EL HOME
window.cambiarCantidadHome = function(id, cambio, maxStock) {
    const input = document.getElementById(`qty-${id}`);
    let nuevoValor = parseInt(input.value) + cambio;
 
    if (nuevoValor >= 1 && (!maxStock || nuevoValor <= maxStock)) {
        input.value = nuevoValor;
    }
};

</script>

<script src="{{ asset('js/products.js') }}"></script>
@endsection