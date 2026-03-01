@extends('layouts.app')

@section('content')

<section class="admin">
    <h2>Crear producto</h2>

    <form>
        <label>Nombre</label>
        <input type="text" placeholder="Nombre del perfume">

        <label>Precio</label>
        <input type="number" placeholder="Precio">

        <label>Descripción</label>
        <textarea placeholder="Descripción del producto"></textarea>

        <label>Imagen (URL)</label>
        <input type="text" placeholder="https://">

        <button class="btn">Guardar</button>
        <a href="/admin/productos" class="btn">Cancelar</a>
    </form>
</section>

@endsection