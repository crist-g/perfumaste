document.addEventListener('DOMContentLoaded', () => {
    const token    = localStorage.getItem('api_token');
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');

    const navbar = document.getElementById('navbar-actions');
    
    if (!navbar) return;

    // Usuario NO logueado
    if (!token || !userName) {
        navbar.innerHTML = `
            <a href="/login" class="login-icon">Iniciar sesión</a>
        `;
        return;
    }

    // Usuario logueado
    let html = `
        <a href="/perfil" class="profile-link">
            <img src="/images/icons/user.png" alt="Perfil" style="width: 20px; vertical-align: middle;">
            Mi Perfil
        </a>
        <span class="login-icon">
            Bienvenido, <strong>${userName}</strong>
        </span>

        <a href="/carrito">
            <img src="/images/icons/cart.png" class="login-icon" alt="Carrito">
        </a>
    `;

    // Admin
    if (userRole == 1) {
        html += `
            <a href="/admin" class="login-icon">
                Panel de administración
            </a>
        `;
    }

    // Logout (Quitamos el ID duplicado de la imagen)
    html += `
        <a href="/login" id="btn-salir">
            <img src="/images/icons/logout.png" class="login-icon logout-btn" alt="Salir">
        </a>
    `;

    navbar.innerHTML = html;

    // Cerrar sesión
    document.getElementById('btn-salir').addEventListener('click', e => {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/login';
    });
});