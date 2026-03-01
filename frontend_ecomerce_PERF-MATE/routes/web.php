<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('home');
})->name('home');

/* LOGIN */
Route::get('/login', fn() => view('auth.login'))->name('login');

Route::post('/login', function (Request $request) {

    $email = $request->email;
    $password = $request->password;

    // ADMIN
    if ($email === 'mau@example.com' && $password === 'hola') {
        session([
            'role' => 'admin',
            'email' => $email
        ]);

        return redirect('/admin');
    }

    // USUARIO NORMAL
    session([
        'role' => 'user',
        'email' => $email
    ]);

    return redirect('/');

})->name('login.submit');

/* LOGOUT */
Route::get('/logout', function () {
    session()->flush();
    return redirect('/');
})->name('logout');

Route::get('/register', function () {
    return view('auth.register');
})->name('register');

Route::get('/producto/{id}', function ($id) {
    return view('product.show', compact('id'));
})->name('product.show');

Route::get('/admin', 
    fn() => view('admin.dashboard'));

Route::get('/perfil', fn() => view('profile.index'))->name('profile');

Route::get('/pago', fn() => view('profile.payment'))->name('payment');

Route::get('/carrito', function () {
    return view('cart.index');
})->name('cart');

Route::get('/ticket', function () {
    return view('ticket');
});