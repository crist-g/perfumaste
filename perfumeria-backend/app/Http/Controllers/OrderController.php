<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
        ->with('items.product')
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json($orders,200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function checkout(Request $request) {

        $request->validate([
            'payment_id'=> 'required|string',
            'items' => 'required|array' // Los perfumes que vienen del LocalStorage
        ]);

        // Evitar crear la orden si falla la resta de stock
        return DB::transaction(function () use ($request) { 
            $user = Auth::user();
            $cartItems = $request->items; // Leer el paquete que mandó JS

            if(empty($cartItems)) {
                return response()->json(['message' => 'El carrito está vacío'], 400);
            }

            // Calcular total 
            $total = 0;
            foreach ($cartItems as $item) {
                $total += $item['price'] * $item['quantity'];
            }

            // Crear orden 
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'pending',
                'payment_method' => 'paypal',
                'payment_id' => $request->payment_id
            ]);

            // Procesar perfume
            foreach ($cartItems as $item) {
                // Buscar el producto real en la DB para mayor seguridad
                $product = \App\Models\Product::find($item['id']);

                if (!$product) {
                    throw new \Exception('Producto no encontrado: ' . $item['name']);
                }

                // Volver a verificar stock en tiempo real
                if ($product->stock < $item['quantity']){
                    throw new \Exception('Stock insuficiente para el producto: ' . $product->name);
                }

                // Ticket
                \App\Models\OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price
                ]);

                // Restar stock de verdad
                $product->decrement('stock', $item['quantity']);
            }

            return response()->json([
                'message' => 'Orden creada exitosamente',
                'order_id' => $order->id
            ], 201);
        });
    }
}
