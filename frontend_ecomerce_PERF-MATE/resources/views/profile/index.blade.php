@extends('layouts.app')

@section('content')

<section class="profile-container">
    <h1>Mi perfil</h1>

    {{-- DATOS PERSONALES --}}
    <div class="profile-card">
        <div class="card-header">
            <h2>Datos personales</h2>
            <button class="edit-btn" data-section="personal">Editar</button>
        </div>
        <div class="card-content" id="personal-info">
            <p class="loading">Cargando...</p>
        </div>
    </div>

    {{-- DIRECCIÓN --}}
    <div class="profile-card">
        <div class="card-header">
            <h2>Dirección</h2>
            <button class="edit-btn" data-section="address">Editar</button>
        </div>
        <div class="card-content" id="address-info">
            <p class="loading">Cargando...</p>
        </div>
    </div>

    {{-- MÉTODO DE PAGO --}}
    <div class="profile-card">
        <div class="card-header">
            <h2>Método de pago</h2>
            <button class="edit-btn" data-section="payment">Editar</button>
        </div>
        <div class="card-content" id="payment-info">
            <p class="loading">Cargando...</p>
        </div>
    </div>
</section>

{{-- MODAL CREAR --}}
<div class="modal" id="create-modal">
    <div class="modal-box">
        <h3 id="modal-title"></h3>

        <div id="modal-fields"></div>

        <div class="modal-actions">
            <button class="btn small" onclick="closeModal()">Cancelar</button>
            <button class="btn primary" onclick="saveModalData()">Guardar</button>
        </div>
    </div>
</div>

{{-- PEDIDOS --}}
<div class="profile-card">
    <div class="card-header">
        <h2>Mis pedidos</h2>
    </div>
    <div class="card-content" id="orders-info">
        <p class="loading">Cargando pedidos...</p>
    </div>
</div>

<script src="{{ asset('js/profile.js') }}"></script>

@endsection