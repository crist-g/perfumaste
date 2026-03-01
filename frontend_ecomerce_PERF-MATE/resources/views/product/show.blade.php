@extends('layouts.app')

@section('content')

<section class="product-detail">

    <div class="product-card">
        <div class="product-image">
            <img src="https://via.placehold.co/400" alt="Perfume">
        </div>

        <div class="product-info">
            <h2>Nombre del perfume</h2>
            <p class="description">
                Descripción del perfume con notas aromáticas, duración y estilo.
            </p>

            <p class="price">$2,000 MXN</p>

            {{-- Vincular el botón con la función de la API para agregar al carrito --}}
            <button class="btn primary" onclick="addProductFromApi('{{ $id }}')">
                Agregar al carrito
            </button>
        </div>
    </div>

</section>

{{-- SUGERENCIAS --}}
<section class="suggestions">
    <h3>También te puede interesar</h3>

    <div class="suggestion-grid">
        @for ($i = 1; $i <= 4; $i++)
            <div class="suggestion-card">
                <img src="https://via.placehold.co/200" alt="Perfume">
                <h4>Perfume sugerido</h4>
                <p class="price">$1,800 MXN</p>
                <a href="#" class="btn small">Ver producto</a>
            </div>
        @endfor
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', async () => {
    // Obtener el ID que viene de la URL del servidor
    const id = '{{ $id }}'; 
    
    try {
        // Consultar a la API los datos del perfume específico
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
        const product = await response.json();
        
        // Rellenar la información del HTML con los datos de la bd
        document.querySelector('.product-image img').src = product.image_url || 'https://via.placehold.co/400';
        document.querySelector('.product-info h2').textContent = product.name;
        document.querySelector('.product-info .description').textContent = product.description;
        document.querySelector('.product-info .price').textContent = `$${product.price} MXN`;
        
        // BTn para que guarde el producto en el carrito local
        const btn = document.querySelector('.product-info .btn.primary');
        btn.onclick = () => {
            window.agregarAlCarrito(product.id, product.name, product.price, product.image_url);
        };
        
    } catch (error) {
        console.error('Error cargando el detalle del perfume:', error);
    }
});
</script>

@endsection