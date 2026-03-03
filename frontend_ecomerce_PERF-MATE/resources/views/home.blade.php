@extends('layouts.app')

@section('content')

<section class="hero">
    <h1>Encuentra tu fragancia ideal</h1>
    <p>Los mejores aromas al mejor precio</p>
</section>

{{-- FILTROS --}}
<section class="filters">
    <input type="text" id="search" placeholder="Buscar perfume">
    
    <input list="brand-options" id="brand" placeholder="Todas las marcas">
    <datalist id="brand-options"></datalist>

    <input list="category-options" id="category" placeholder="Todas las categorías">
    <datalist id="category-options"></datalist>

    <input type="number" id="min_price" placeholder="Precio mínimo" min="0">
    <input type="number" id="max_price" placeholder="Precio máximo" min="0">

    <button class="btn" id="filter-btn">Filtrar</button>
</section>

{{-- PRODUCTOS --}}
<section class="products">
    <h2>Perfumes</h2>
    <div id="product-grid" class="product-grid">
        {{-- JS inyecta tarjetas aquí --}}
    </div>
</section>

{{-- PLANTILLA DE PRODUCTO --}}
<template id="product-template">
    <article class="product-card">
        <img src="" alt="" class="p-image">
        
        <div class="product-info">
            <h3 class="p-name"></h3>
            <span class="brand p-brand-category"></span>
            <p class="description p-description"></p>
            <div class="price p-price"></div>
            
            <div class="product-quantity-control">
                <span class="stock p-stock"></span>
                <div class="quantity-actions">
                    <button class="btn-qty p-minus">-</button>
                    <input type="number" class="p-qty" value="1" readonly>
                    <button class="btn-qty p-plus">+</button>
                </div>
            </div>
        </div>

        <div class="product-actions">
            <a href="#" class="btn-details p-link">Ver detalles</a>
            <button class="btn-cart p-add-to-cart">Añadir al carrito</button>
        </div>
    </article>
</template>

@endsection

@push('scripts')
<script>
    window.BASE_PRODUCT_URL = "{{ url('/producto') }}";
</script>
<script src="{{ asset('js/products.js') }}"></script>
@endpush