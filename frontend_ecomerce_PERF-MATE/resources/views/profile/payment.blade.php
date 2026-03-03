@extends('layouts.app')

@section('content')

<section class="checkout-container">

    <h1>Confirmar compra</h1>

    <div class="checkout-grid">

        {{-- RESUMEN DEL PEDIDO --}}
        <div class="checkout-card">
            <h2>Productos</h2>
            <div id="checkout-products">
                <p class="loading">Cargando productos...</p>
            </div>
            <div class="total">
                <span>Total</span>
                <strong id="checkout-total">$0</strong>
            </div>
        </div>

        {{-- DIRECCIÓN --}}
        <div class="checkout-card">
            <h2>Dirección de envío</h2>
            <div id="checkout-address">
                <p class="loading">Cargando dirección...</p>
            </div>
        </div>

        {{-- ACCIÓN --}}
        <div class="checkout-action">
            <div id="paypal-button-container" style="width: 100%; margin-top: 20px;"></div>
            {{-- PP Sandbox --}}
            <script src="https://www.paypal.com/sdk/js?client-id=AQu1GGVq8DWiKNNJaj_VpzJmKpDG5BrBAknMYvccI0zL5hmmRs1CuZ91cyfSAhgfNbTN_dEHWsZTcwlt&currency=MXN"></script>
        </div>

    </div>

</section>

@endsection