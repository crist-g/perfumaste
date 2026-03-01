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
</head>

<body>

    {{-- NAVBAR --}} 
    <header class="navbar">
        <div class="logo">
            <a href="{{ route('home') }}">
                <img src="{{ asset ('images/logo/logo.png') }}" class="logo-image">
            </a>
        </div>

        <div class="actions">

            {{-- ADMIN --}} 
            @if(session('role') === 'admin')
            <a href="/admin" class="login-icon">Panel de administración</a>
            <a href="{{ route('logout') }}">
                <img src="{{ asset('images/icons/logout.png') }}" class="login-icon">
            </a>

            {{-- USUARIO --}}
            @elseif(session('role') === 'user')
            
            <a href="{{ route('profile') }}">
                <img src="{{ asset('images/icons/user.png') }}" class="login-icon">
            </a>
            <a href="{{ route('cart') }}">
                <img src="{{ asset('images/icons/cart.png') }}" class="login-icon">
            </a>
            <a href="{{ route('logout') }}">
                <img src="{{ asset('images/icons/logout.png') }}" class="login-icon">
            </a>


            {{-- INVITADO --}}
            @else
            <a href="{{ route('login') }}" class="login-icon">
                Iniciar sesión
            </a>
            @endif

        </div>
    </header>

    <main>
        @yield('content')
    </main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Obtener los datos de sesión guardados en el navegador
    const token = localStorage.getItem('api_token');
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');

    // Buscar el enlace de login para reemplazarlo si hay sesión activa
    const loginLink = document.querySelector('a[href*="login"], a[href="#"], #logout-btn');
    
    // Verificar si existe un token y nombre de usuario para cambiar el menú
    if (token && userName && loginLink) {
        let navHtml = `<span style="margin-right: 15px;">Bienvenido, <strong>${userName}</strong></span>`;
        
        // CARRITO
        // Btn directo al carrito para cualquier usuario logueado
        navHtml += `<a href="/carrito" class="btn" style="margin-right: 15px; background: #28a745; color:#fff; padding: 5px 10px; text-decoration: none; border-radius: 5px;">🛒 Mi Carrito</a>`;
        
        // ADMIN
        // Mostrar el acceso al panel de control solo si el rol es de administrador (1)
        if (userRole == 1) {
            navHtml += `<a href="/admin" class="btn" style="margin-right: 15px; background: #000; color:#fff; padding: 5px 10px; text-decoration: none; border-radius: 5px;">Panel Admin</a>`;
        }
        
        // Cerrar sesión
        navHtml += `<a href="#" id="btn-salir" style="color: red; text-decoration: none;">Cerrar Sesión</a>`;
        
        // Inyectar el nuevo menú en el encabezado
        loginLink.parentElement.innerHTML = navHtml;
        
        document.getElementById('btn-salir').onclick = function(e) {
            e.preventDefault();
            localStorage.clear(); // Borrar los datos de la sesión local
            window.location.href = '/login';
        };
    }
});
</script>

<script src="{{ asset('js/app.js') }}"></script>
<script src="{{ asset('js/cart.js') }}"></script>
<script src="{{ asset('js/profile.js') }}"></script>
<script src="{{ asset('js/payment.js') }}"></script>
<script src="{{ asset('js/admin.js') }}"></script>

</html>