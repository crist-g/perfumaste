@extends('layouts.app')

@section('content')

<section class="admin-container">

    <div class="admin-header">
        <h1>Panel de administración</h1>
        <button id="create-product-btn" class="btn-primary">
            + Nuevo perfume
        </button>
        <a href="{{ route('admin.orders') }}" class="btn-primary">📦 Pedidos</a>
    </div>


    {{-- LISTADO --}}
    <div class="admin-card">
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Marca</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody id="products-table">
                <tr>
                    <td colspan="5" class="loading">
                        Cargando productos...
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</section>

{{-- MODAL --}}
<div id="product-modal" class="modal hidden">
    <div class="modal-content">
        <h2 id="modal-title"></h2>

        <form id="product-form">
            <input type="hidden" id="product-id">

            <input type="text" id="name" placeholder="Nombre" required>
            <input type="text" id="brand" placeholder="Marca" required>
            <input type="number" id="price" placeholder="Precio" required>
            <input type="number" id="stock" placeholder="Stock" required>
            
            <textarea id="description" placeholder="Descripción completa del perfume..." required style="width: 100%; margin-bottom: 10px;"></textarea>

            {{-- SUBIR IMAGEN --}}
            <div class="image-upload" style="margin: 15px 0; border: 1px dashed #ccc; padding: 10px;">
                <label for="image"><strong>Subir foto del perfume:</strong></label><br>
                <input type="file" id="image" accept="image/*">
            </div>

            <div class="modal-actions">
                <button type="submit" class="btn-primary">
                    Guardar
                </button>
                <button type="button" id="cancel-btn" class="btn-secondary">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</div>

@endsection