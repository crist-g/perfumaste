@extends('layouts.app')

@section('content')
<section class="auth">
    <h2>Iniciar sesión</h2>
    <form id="login-form">
        <input type="email" id="email" placeholder="Correo electrónico" required>
        <input type="password" id="password" placeholder="Contraseña" required>
        <button type="submit" class="btn">Entrar</button>
    </form>
    <p>¿No tienes una cuenta? <a href="{{ route('register') }}">Regístrate aquí</a></p>
</section>

<script>

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Enviar los datos del formulario al backend del servidor
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar el token de acceso para que no se cierre la sesión
                localStorage.setItem('api_token', data.access_token);
                // Para mostar al usuario en el navbar
                localStorage.setItem('user_name', data.user.name);
                // Guardar el rol para saber si es Admin o cliente
                localStorage.setItem('user_role', data.role);
                alert('¡Bienvenido!');
                
                // Revisar el rol para mandar a la página correcta
                if (data.role == 1) {
                    window.location.href = '/admin'; // Panel de administración
                } else {
                    window.location.href = '/'; // Solo compras
                }
            } else {
                alert('Error: ' + (data.message || 'Credenciales incorrectas'));
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión con el Backend.');
        }
    });
});
</script>

@endsection