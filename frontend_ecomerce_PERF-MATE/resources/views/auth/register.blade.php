@extends('layouts.app')

@section('content')
<section class="auth">
    <h2>Registrarse</h2>
    <form id="register-form">
        <input type="text" id="name" placeholder="Nombre completo" required>
        <input type="email" id="email" placeholder="Correo electrónico" required>
        
        <input type="password" id="password" placeholder="Contraseña (Mínimo 8 caracteres)" required minlength="8">
        <input type="password" id="password_confirmation" placeholder="Confirmar contraseña" required minlength="8">
        
        <button type="submit" class="btn">Crear cuenta</button>
    </form>
    <p><a href="{{ route('home') }}">Vuelve al inicio</a></p>
</section>


<script>
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('register-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Obtener valores
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const password_confirmation = document.getElementById('password_confirmation').value;

        // Comprobar que las contraseñas coincidan 
        if (password !== password_confirmation) {
            alert('Las contraseñas no coinciden. ¡Revisa bien!');
            return;
        }

        try {
            // Enviar datos de registro a la API 
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password, 
                    password_confirmation 
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
                window.location.href = '/login';
            } else {
                console.log("Error del backend:", data);
                const errorMsg = data.message || "Error en los datos. Intenta con otro correo o contraseña más larga.";
                alert('Fallo en el registro: \n' + errorMsg);
            }
        } catch (error) {
            console.error(error);
            alert('Error conectando al servidor 8000.');
        }
    });
});
</script>
@endsection