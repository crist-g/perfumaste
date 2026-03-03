@extends('layouts.app')

@section('content')

<section class="product-detail">

    <div class="product-card">

        <!-- Imagen -->
        <div class="product-image">
            <img id="product-image" src="https://via.placehold.co/500" alt="Perfume">
        </div>

        <!-- Información principal -->
        <div class="product-info">
            <h2 id="product-name">Cargando...</h2>

            <p class="price" id="product-price">$0 MXN</p>

            <p class="category" id="product-category"></p>

            <button class="btn primary" id="add-to-cart-btn" disabled>
                Agregar al carrito
            </button>
        </div>

    </div>

    <div class="product-description-box">
        <h3>Descripción del producto</h3>
        <p class="description" id="product-description">
            Cargando descripción...
        </p>
    </div>
<script src="{{ asset('js/details.js') }}"></script>

</section>

<input type="hidden" id="product-id" value="{{ $id }}">

<script src="{{ asset('js/details.js') }}"></script>

@endsection