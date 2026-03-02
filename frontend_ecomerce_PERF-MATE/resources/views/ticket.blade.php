@extends('layouts.app')

@section('content')
<div class="order-success-wrapper">
    <div class="order-success-card">
        <div class="success-icon">
            ✓
        </div>

        <h1 class="success-title">Compra realizada con éxito</h1>
        <p class="success-subtitle">
            Gracias por confiar en nosotros. Tu pedido ha sido procesado correctamente.
        </p>

        <div class="order-box">
            <span class="order-label">Número de orden</span>
            <span class="order-number">#{{ request()->query('order') }}</span>
        </div>

        <a href="/" class="back-button">
            Volver a la tienda
        </a>
    </div>
</div>
@endsection