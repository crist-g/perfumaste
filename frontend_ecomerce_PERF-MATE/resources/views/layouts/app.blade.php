<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>PERFÚMATE</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    {{-- CSS --}}
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('css/profile.css') }}">
    <link rel="stylesheet" href="{{ asset('css/payment.css') }}">
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
    <link rel="stylesheet" href="{{ asset('css/cart.css') }}">
    <link rel="stylesheet" href="{{ asset('css/success-view.css') }}">
</head>

<body>

    {{-- NAVBAR --}} 
   <header class="navbar">
    <div class="logo">
        <a href="{{ route('home') }}">
            <img src="{{ asset('images/logo/logo.png') }}" class="logo-image">
        </a>
    </div>

    <div class="actions" id="navbar-actions">
        <a href="{{ route('login') }}" class="login-icon" id="login-link">
            Iniciar sesión
        </a>
    </div>
</header>

    <main>
        @yield('content')
    </main>


<script src="{{ asset('js/app.js') }}"></script>
<script src="{{ asset('js/cart.js') }}"></script>
<script src="{{ asset('js/profile.js') }}"></script>
<script src="{{ asset('js/payment.js') }}"></script>
<script src="{{ asset('js/admin.js') }}"></script>
<script src="{{ asset('js/navbar.js') }}"></script>

</html>