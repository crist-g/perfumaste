@extends('layouts.app')

@section('content')

<section class="cart">
    <h2>Tu carrito</h2>

    <div id="cart-items" class="cart-items">
        
    </div>

    <div class="cart-summary">
        <h3>Total: $<span id="cart-total">0</span></h3>
        <a href="{{ route('payment') }}" class="btn">Proceder al pago</a>
    </div>
</section>

<script src="{{ asset('js/cart.js') }}"></script>
@endsection