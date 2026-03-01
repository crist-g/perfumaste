@extends('layouts.app')

@section('content')

<section class="admin">
    <h2>Editar producto</h2>

    <form>
        <label>Nombre</label>
        <input type="text" value="Dior Sauvage">

        <label>Precio</label>
        <input type="number" value="2300">

        <label>Descripción</label>
        <textarea>Perfume masculino</textarea>

        <label>Imagen (URL)</label>
        <input type="text" value="https://via.m/200">

        <button class="btn">Actualizar</button>
        <a href="/admin/productos" class="btn">Cancelar</a>
    </form>
</section>

@endsection