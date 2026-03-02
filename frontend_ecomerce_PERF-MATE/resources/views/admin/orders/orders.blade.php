@extends('layouts.app')

@section('content')

<section class="admin-container">

    <div class="admin-header">
        <h2>Pedidos</h2>
        <a href="/admin" class="btn-secondary">⬅ Volver a productos</a>
    </div>

    <div class="admin-card">
        <table class="admin-table">
            <thead>
                <tr>
                    <th># Pedido</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Actualizar</th>
                </tr>
            </thead>
            <tbody id="orders-table">
                <tr>
                    <td colspan="5" class="loading">Cargando pedidos...</td>
                </tr>
            </tbody>
        </table>
    </div>

</section>

<script src="{{ asset('js/admin-orders.js') }}"></script>

@endsection