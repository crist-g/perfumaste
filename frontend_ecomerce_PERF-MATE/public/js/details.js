document.addEventListener('DOMContentLoaded', async () => {
    const productId = document.getElementById('product-id').value;
    const btnAdd = document.getElementById('add-to-cart-btn');

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}`);
        const product = await response.json();

        /* PINTAR DATOS */

        document.getElementById('product-image').src =
            product.image_url || 'https://via.placehold.co/400';

        document.getElementById('product-name').textContent =
            product.name;

        document.getElementById('product-description').textContent =
            product.description;

        document.getElementById('product-price').textContent =
            `$${product.price} MXN`;

        document.getElementById('product-category').textContent =
            `Categoría: ${product.category.name}`;

        /* BOTÓN CARRITO */

        btnAdd.disabled = false;
        btnAdd.addEventListener('click', () => {
            window.agregarAlCarrito(
                product.id,
                product.name,
                product.price,
                product.image_url
            );
        });

    } catch (error) {
        console.error('Error cargando el detalle del producto:', error);
    }
});