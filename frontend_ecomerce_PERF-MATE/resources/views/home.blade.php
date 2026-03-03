@extends('layouts.app')

@section('content')

<section class="hero">
    <h1>Encuentra tu fragancia ideal</h1>
    <p>Los mejores aromas al mejor precio</p>
</section>

{{-- FILTROS --}}
<section class="filters">
    <input type="text" id="search" placeholder="Buscar perfume">
    
    {{-- SELECTOR HÍBRIDO --}}
    <input list="brand-options" id="brand" placeholder="Todas las marcas">
    <datalist id="brand-options">
    </datalist>

    <input list="category-options" id="category" placeholder="Todas las categorías">
    <datalist id="category-options">
    </datalist>

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

    <div id="pagination" class="pagination"></div>
</section>

@endsection

@push('scripts')
<script src="{{ asset('js/products.js') }}"></script>
@endpush