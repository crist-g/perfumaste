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

    {{-- MIS PEDIDOS --}}
    <div class="profile-card">
        <div class="card-header">
            <h2>Mis pedidos</h2>
        </div>
        <div class="card-content" id="orders-info">
            <p class="loading">Cargando pedidos...</p>
        </div>
    </div>
</section>

{{-- MODAL CREAR --}}
<div class="modal hidden" id="data-modal"> 
    <div class="modal-box">
        <h3 id="modal-title" class="modal-title"></h3> 
        <form id="modal-form"> 
            <div id="modal-fields" class="modal-body"></div> 
            <div class="modal-actions">
                <button type="button" class="btn small" onclick="profileCloseModal()">Cancelar</button>
                <button type="submit" class="btn primary">Guardar</button>
            </div>
        </form>
    </div>
</div>

{{-- TEMPLATE PARA LAS ORDENES (Respeta tu CSS) --}}
<template id="order-template">
    <div class="order-item">
        <div class="order-header">
            <span class="order-id"></span>
            <span class="order-status"></span>
        </div>
        <div class="order-meta">
            <span class="order-count"></span>
            <span class="order-total"></span>
        </div>
        <div class="order-date"></div>
    </div>
</template>

@endsection

@push('scripts')
<script src="{{ asset('js/profile.js') }}"></script>
@endpush