<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>PERFÚMATE</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    {{-- Configuración Global de la API --}}
    <script>
        window.APP_CONFIG = {
            apiUrl: 'http://127.0.0.1:8000/api'
        };
    </script>

    {{-- CSS --}}
    <link rel="stylesheet" href="{{ asset('css/profile.css') }}">
    <link rel="stylesheet" href="{{ asset('css/payment.css') }}">
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('css/success-view.css') }}">
    <link rel="stylesheet" href="{{ asset('css/admin-orders.css') }}">
    <link rel="stylesheet" href="{{ asset('css/product-cart.css') }}">

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
            <a href="{{ route('profile') }}" class="profile-link">
                <img src="{{ asset('images/icons/user.png') }}" alt="Perfil" style="width: 20px; vertical-align: middle;">
                Mi Perfil
            </a>

            <a href="{{ route('login') }}" class="login-icon" id="login-link">
                Iniciar sesión
            </a>
        </div>
    </header>

    <main>
        @yield('content')
    </main>

    {{-- SCRIPTS --}}
    <script src="{{ asset('js/app.js') }}?v={{ filemtime(public_path('js/app.js')) }}"></script>
    <script src="{{ asset('js/cart.js') }}?v={{ filemtime(public_path('js/cart.js')) }}"></script>
    <script src="{{ asset('js/payment.js') }}?v={{ filemtime(public_path('js/payment.js')) }}"></script>
    <script src="{{ asset('js/admin.js') }}?v={{ filemtime(public_path('js/admin.js')) }}"></script>
    <script src="{{ asset('js/navbar.js') }}?v={{ filemtime(public_path('js/navbar.js')) }}"></script>

    {{-- additional page-specific scripts --}}
    @stack('scripts')

</body>
</html>