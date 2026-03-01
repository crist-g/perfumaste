<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']); // Catalogo
Route::get('/products/{id}', [ProductController::class, 'show']); // Detalles
Route::post('/register', [AuthController::class, 'register']);

// Admin Rutas
Route::post('/products', [ProductController::class, 'store']); // Crear
Route::put('/products/{id}', [ProductController::class, 'update']); // Editar
Route::delete('/products/{id}', [ProductController::class, 'destroy']); // Eliminar

Route::middleware('auth:sanctum')->group(function () {

    // Cerrar sesión
    Route::post('/logout', [AuthController::class, 'logout']);

    // Perfil
    Route::get('/user', function(Request $request){
        return $request->user();
    });

    // Ver carrito
    Route::get('/cart', [CartController::class, 'index']);

    // Agregar al carrito
    Route::post('/cart', [CartController::class, 'store']);

    // "Respuesta de PP"
    Route::post('/checkout', [OrderController::class, 'checkout']);

    // Historial
    Route::get('/orders', [OrderController::class, 'index']);
} );
