@extends('layouts.app')

@section('content')

<section class="admin">
    <h2>Productos</h2>

    <a href="/admin/productos/crear" class="btn">➕ Nuevo producto</a>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Dior Sauvage</td>
                <td>$2,300</td>
                <td>
                    <a href="/admin/productos/1/editar" class="btn">Editar</a>
                    <button class="btn danger">Eliminar</button>
                </td>
            </tr>

            <tr>
                <td>2</td>
                <td>Versace Eros</td>
                <td>$1,950</td>
                <td>
                    <a href="/admin/productos/2/editar" class="btn">Editar</a>
                    <button class="btn danger">Eliminar</button>
                </td>
            </tr>
        </tbody>
    </table>

</section>

@endsection