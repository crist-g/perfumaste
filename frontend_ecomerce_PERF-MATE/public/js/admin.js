document.addEventListener('DOMContentLoaded', () => {

    // Ejecutar carga inicial si la tabla de productos existe 
    if (document.getElementById('products-table')) {
        loadProducts();
    }

    // Control de eventos para apertura, cierre y envío del formulario
    const createBtn = document.getElementById('create-product-btn');
    if (createBtn) createBtn.addEventListener('click', () => openModal());

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    const productForm = document.getElementById('product-form');
    if (productForm) productForm.addEventListener('submit', saveProduct);
});

// CARGA DE DATOS
async function loadProducts() {
    try {
        // Consultar lista de perfumes al servidor backend 
        const response = await fetch(`http://127.0.0.1:8000/api/products`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

// RENDERIZADO
function renderProducts(products) {
    const tbody = document.getElementById('products-table');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Generar filas dinámicamente e inyectar botones con funciones globales
    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.name}</td>
            <td>${p.brand}</td>
            <td>$${p.price}</td>
            <td>${p.stock}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editProduct(${p.id})">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// CONTROL DE MODAL
function openModal(product = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    modal.classList.remove('hidden');
    form.reset();

    // Editar o crear perfume
    if (product) {
        document.getElementById('modal-title').textContent = 'Editar perfume';
        document.getElementById('product-id').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('brand').value = product.brand;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
    } else {
        document.getElementById('modal-title').textContent = 'Nuevo perfume';
        document.getElementById('product-id').value = '';
    }
}

function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// GUARDAR PRODUCTO
async function saveProduct(e) {
    e.preventDefault();

    // Validar existencia de token en LocalStorage antes de procesar
    const token = localStorage.getItem('api_token');
    if (!token) {
        alert('No hay sesión activa. Por favor inicia sesión.');
        return;
    }
    
    const id = document.getElementById('product-id').value;

    // Usar FormData para permitir imágenes al servidor
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('brand', document.getElementById('brand').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('stock', document.getElementById('stock').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('category_id', 1);

    // Adjuntar archivo de imagen 
    const imageInput = document.getElementById('image');
    if (imageInput && imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    // Determinar URL según el ID (POST rear, ID para editar)
    const url = id ? `http://127.0.0.1:8000/api/products/${id}` : `http://127.0.0.1:8000/api/products`;
    
    // Simular método PUT mediante POST para compatibilidad de Laravel con archivos
    if (id) {
        formData.append('_method', 'PUT');
    }

    try {
        const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData 
        });

        const data = await response.json();

        if (response.ok) {
            alert('¡Guardado exitosamente!');
            closeModal();
            loadProducts();
        } else if (response.status === 422) {
            let errorMsg = 'Datos inválidos:\n';
            for (const field in data.errors) {
                errorMsg += `- ${data.errors[field].join(', ')}\n`;
            }
            alert(errorMsg);
        } else {
            alert('Error del servidor: ' + (data.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo conectar con el servidor 8000.');
    }
}

// ACCIONES GLOBALES
window.editProduct = async function(id) {
    const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
    const product = await response.json();
    openModal(product);
};

window.deleteProduct = async function(id) {
    if (!confirm('¿Seguro que quieres eliminarlo?')) return;
    const token = localStorage.getItem('api_token');
    
    const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) loadProducts();
};