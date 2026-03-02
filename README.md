# Ecommerce Perfumate

Este repositorio contiene el **Backend (API)** y el **Frontend (Vistas)** del proyecto. A continuación se describen los pasos necesarios para levantar el entorno local correctamente.

## 📂 Estructura del proyecto

* `perfumeria-backend/`: API y base de datos.
* `frontend_ecommerce_PERF-MATE/`: interfaz de usuario y consumo de la API.

---

## 1. Configuración del Backend

Desde una terminal, accede a la carpeta del backend y ejecuta:

```bash
cd perfumeria-backend
composer install
cp .env.example .env
php artisan key:generate
```

### Base de datos y carga de datos iniciales

Configura las credenciales de tu base de datos en el archivo `.env` y luego ejecuta:

```bash
php artisan migrate:fresh --seed
```

Este comando creará la estructura de la base de datos y cargará los datos iniciales, incluyendo perfumes y usuarios de prueba.

### Solución para imágenes rotas

Si al clonar o añadir perfumes las imágenes no se muestran correctamente, ejecuta:

```bash
php artisan storage:link
```

Esto regenerará el enlace simbólico necesario para servir las imágenes almacenadas.

### Iniciar el backend

```bash
php artisan serve
```

El backend debe estar disponible en:

`http://127.0.0.1:8000`

> Este puerto es necesario para el correcto funcionamiento de la pasarela de pago y la carga de productos.

---

## 2. Configuración del Frontend

En una nueva terminal, accede a la carpeta del frontend y ejecuta:

```bash
cd frontend_ecommerce_PERF-MATE
composer install
npm install
cp .env.example .env
php artisan key:generate
```

### Iniciar el frontend

Como el puerto `8000` será utilizado por el backend, inicia el frontend en el puerto `8001`:

```bash
php artisan serve --port=8001
```

Luego abre en tu navegador:

`http://127.0.0.1:8001`

