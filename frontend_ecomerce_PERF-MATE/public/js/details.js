document.addEventListener('DOMContentLoaded', async () => {
    const productId = document.getElementById('product-id').value;
    const btnAdd = document.getElementById('add-to-cart-btn');

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}`);
        const product = await response.json();
        let imagenFinal = `https://placehold.co/400x400/000000/FFF?text=${encodeURIComponent(product.name)}`;
        
        if (product.image_url) {
            if (product.image_url.includes('placehold.co')) {
                imagenFinal = `https://placehold.co/400x400/000000/FFF?text=${encodeURIComponent(product.name)}`;
            } else if (product.image_url.startsWith('/storage')) {
                // Imagen subida desde el admin con ruta completa
                imagenFinal = `http://127.0.0.1:8000${product.image_url}`;
            } else if (!product.image_url.startsWith('http')) {
                // Imagen subida desde el admin pero con ruta corta
                imagenFinal = `http://127.0.0.1:8000/storage/${product.image_url}`;
            } else {
                // URLs válidas externas 
                imagenFinal = product.image_url;
            }
        }

        /* PINTAR DATOS */
        document.getElementById('product-image').src = imagenFinal;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-description').textContent = product.description || 'Sin descripción';
        document.getElementById('product-price').textContent = `$${product.price} MXN`;
        
        // Por si el perfume no tiene categoría
        const catName = product.category ? product.category.name : 'Sin categoría';
        document.getElementById('product-category').textContent = `Categoría: ${catName}`;

        /* BOTÓN CARRITO */
        btnAdd.disabled = false;
        btnAdd.addEventListener('click', () => {
            window.agregarAlCarrito(
                product.id,
                product.name,
                product.price,
                imagenFinal // Mandar la imagen correcta al carrito
            );
        });

    } catch (error) {
        console.error('Error cargando el detalle del producto:', error);
    }
});