// ==============================
// APP CONFIG & HELPERS
// ==============================

function isUserLogged() {
    return window.APP_CONFIG.isLogged;
}

function redirectToLogin() {
    window.location.href = '/login';
}

// UI helpers
function showAlert(message) {
    alert(message);
}