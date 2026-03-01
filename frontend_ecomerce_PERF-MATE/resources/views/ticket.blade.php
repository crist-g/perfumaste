@extends('layouts.app')

@section('content')
<div style="text-align: center; padding: 100px 20px; font-family: sans-serif;">
    <h1 style="color: #28a745; font-size: 3.5rem; margin-bottom: 10px;">¡Gracias por tu compra! 🎉</h1>
    <p style="font-size: 1.5rem; color: #555;">Tu pedido ha sido procesado con éxito.</p>
    
    <div style="background: #f8f9fa; border: 2px dashed #ccc; padding: 20px; display: inline-block; margin-top: 30px; border-radius: 10px;">
        <p style="margin: 0; font-size: 1.2rem;">Número de Orden:</p>
        <h2 style="margin: 5px 0; font-size: 2.5rem; color: #000;">#{{ request()->query('order') }}</h2>
    </div>

    <br>
    <a href="/" style="display: inline-block; margin-top: 40px; background: #000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; transition: 0.3s;">
        Volver a la tienda
    </a>
</div>
@endsection