if (!window._perfCategories) window._perfCategories = [];

document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('products-table')) {
        loadProducts();
    }

    // Control de eventos para apertura, cierre y envío del formulario
    const createBtn = document.getElementById('create-product-btn');
    if (createBtn) createBtn.addEventListener('click', () => openProductModal());

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) cancelBtn.addEventListener('click', closeProductModal);

    const productForm = document.getElementById('product-form');
    if (productForm) productForm.addEventListener('submit', saveProduct);
});

function populateCategorySelect(selectedId) {
    const sel = document.getElementById('category_id');
    if (!sel) return;
    sel.innerHTML = '<option value="" disabled>Seleccione categoría</option>';
    window._perfCategories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        if (selectedId && parseInt(selectedId) === c.id) {
            opt.selected = true;
        }
        sel.appendChild(opt);
    });
}

async function loadProducts() {
    try {
        // Consultar lista de perfumes al servidor backend 
        const response = await fetch(`http://127.0.0.1:8000/api/products`);
        const products = await response.json();

            // glean categories attached to products (fallback when no categories endpoint)
            const map = {};
            products.forEach(p => {
                if (p.category && typeof p.category === 'object' && p.category.id) {
                    map[p.category.id] = p.category.name;
                }
            });
            // mutate the shared categories array rather than reassigning to avoid redeclaration issues
            window._perfCategories.length = 0;
            Object.entries(map).forEach(([id,name]) => window._perfCategories.push({id: parseInt(id), name}));

            populateCategorySelect();

        renderProducts(products);
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function renderProducts(products) {
    const tbody = document.getElementById('products-table');
    if (!tbody) return;
    tbody.innerHTML = '';

    products.forEach(p => {
        const categoryName = p.category ? (typeof p.category === 'object' ? p.category.name : p.category) : '';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.name}</td>
            <td>${p.brand}</td>
            <td>${categoryName}</td>
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

function openProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    modal.classList.remove('hidden');
    form.reset();

    // ensure category dropdown is populated (might have been filled by loadProducts already)
    populateCategorySelect(product && product.category ? (product.category.id || product.category) : null);

    // Editar o crear perfume
    if (product) {
        document.getElementById('modal-title').textContent = 'Editar perfume';
        document.getElementById('product-id').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('brand').value = product.brand;
        document.getElementById('price').value = product.price;
        document.getElementById('stock').value = product.stock;
        // set category if available
        if (product.category) {
            const cid = typeof product.category === 'object' ? product.category.id : product.category;
            document.getElementById('category_id').value = cid;
        }
        // make sure existing description populates when editing
        if (product.description) {
            document.getElementById('description').value = product.description;
        }
    } else {
        document.getElementById('modal-title').textContent = 'Nuevo perfume';
        document.getElementById('product-id').value = '';
    }
}

function closeProductModal() {
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
    const catSel = document.getElementById('category_id');
    if (catSel && catSel.value) {
        formData.append('category_id', catSel.value);
    }

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
            closeProductModal();
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

window.editProduct = async function(id) {
    const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
    const product = await response.json();
    openProductModal(product);
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