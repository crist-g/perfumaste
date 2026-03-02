document.addEventListener('DOMContentLoaded', () => {
    const token    = localStorage.getItem('api_token');
    const userName = localStorage.getItem('user_name');
    const userRole = localStorage.getItem('user_role');

    const navbar = document.getElementById('navbar-actions');

    // Usuario NO logueado
    if (!token || !userName) {
        navbar.innerHTML = `
            <a href="/login" class="login-icon">Iniciar sesión</a>
        `;
        return;
    }

    // Usuario logueado
    let html = `
        <span class="login-icon">
            Bienvenido, <strong>${userName}</strong>
        </span>

        <a href="/profile">
            <img src="/images/icons/user.png" class="login-icon">
        </a>

        <a href="/cart">
            <img src="/images/icons/cart.png" class="login-icon">
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

    // Logout
    html += `
        <a href="/login" id="btn-salir">
            <img src="/images/icons/logout.png" class="login-icon logout-btn" id="btn-salir">
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