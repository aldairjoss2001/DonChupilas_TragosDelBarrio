# 🍻 DON CHUPILAS - Sistema Web MERN Stack

Sistema web integral de licorería con entrega a domicilio, desarrollado con el stack MERN (MongoDB, Express, React, Node.js).

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Roles de Usuario](#roles-de-usuario)

## 🎯 Descripción

**DON CHUPILAS** es un sistema web completo para gestión de licorería con delivery que incluye:
- **App de Cliente**: Catálogo, carrito, checkout y tracking de pedidos
- **Panel Administrativo**: Dashboard, gestión de inventario, pedidos y usuarios
- **App de Repartidor**: Cola de pedidos, rutas y actualización de estados

## ✨ Características

### Cliente
- 🛒 Catálogo dinámico con filtros por categoría
- 🛍️ Carrito de compras con cálculo automático
- 💳 Checkout con múltiples métodos de pago
- 📍 Seguimiento en tiempo real con mapa interactivo
- 🎁 Sección de promociones y combos

### Administrador
- 📊 Dashboard con gráficas de ventas
- 📦 CRUD completo de productos e inventario
- 👥 Gestión de usuarios y repartidores
- 🚚 Asignación manual de repartidores

### Repartidor
- 📋 Cola de pedidos disponibles
- 🗺️ Mapa interactivo con rutas
- ✅ Actualización de estados en tiempo real

## 🛠️ Tecnologías

### Backend
- Node.js & Express
- MongoDB & Mongoose
- JWT para autenticación
- Socket.io para tiempo real
- Bcrypt para encriptación

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Socket.io Client
- Leaflet (Mapas)
- Chart.js (Gráficas)
- React Toastify

## 📁 Estructura del Proyecto

```
DonChupilas_TragosDelBarrio/
├── backend/
│   ├── config/
│   │   └── db.js                 # Configuración de MongoDB
│   ├── controllers/
│   │   ├── authController.js     # Autenticación
│   │   ├── productController.js  # Productos
│   │   └── orderController.js    # Pedidos
│   ├── middleware/
│   │   ├── auth.js               # Middleware JWT
│   │   └── error.js              # Manejo de errores
│   ├── models/
│   │   ├── User.js               # Schema de Usuario
│   │   ├── Product.js            # Schema de Producto
│   │   └── Order.js              # Schema de Pedido
│   ├── routes/
│   │   ├── auth.js               # Rutas de autenticación
│   │   ├── products.js           # Rutas de productos
│   │   └── orders.js             # Rutas de pedidos
│   ├── utils/
│   │   └── jwt.js                # Utilidades JWT
│   ├── server.js                 # Servidor principal
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── logoprincipal_1.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Componentes compartidos
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── admin/            # Componentes admin
│   │   │   │   └── AdminSidebar.jsx
│   │   │   ├── delivery/         # Componentes repartidor
│   │   │   │   └── DeliverySidebar.jsx
│   │   │   └── layouts/          # Layouts
│   │   │       ├── ClientLayout.jsx
│   │   │       ├── AdminLayout.jsx
│   │   │       └── DeliveryLayout.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Contexto de autenticación
│   │   ├── pages/
│   │   │   ├── auth/             # Páginas de autenticación
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── client/           # Páginas de cliente
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Catalog.jsx
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   ├── Cart.jsx
│   │   │   │   ├── Checkout.jsx
│   │   │   │   ├── OrderTracking.jsx
│   │   │   │   └── MyOrders.jsx
│   │   │   ├── admin/            # Páginas de admin
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   └── Users.jsx
│   │   │   └── delivery/         # Páginas de repartidor
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Orders.jsx
│   │   │       └── Route.jsx
│   │   ├── services/
│   │   │   ├── productService.js # Servicios de productos
│   │   │   └── orderService.js   # Servicios de pedidos
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── .env.example
├── .gitignore
├── index.html                    # Landing page original
└── README.md
```

## 🚀 Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB (local o Atlas)
- npm o yarn

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/aldairjoss2001/DonChupilas_TragosDelBarrio.git
cd DonChupilas_TragosDelBarrio
```

### Paso 2: Instalar dependencias del Backend
```bash
cd backend
npm install
```

### Paso 3: Instalar dependencias del Frontend
```bash
cd ../frontend
npm install
```

## ⚙️ Configuración

### Backend

1. Copiar el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Configurar las variables de entorno en `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/donchupilas
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend

El frontend está configurado para conectarse al backend en `http://localhost:5000` mediante proxy.

## 🎮 Uso

### Desarrollo

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
El servidor se iniciará en `http://localhost:5000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
La aplicación se abrirá en `http://localhost:3000`

### Producción

#### Backend:
```bash
cd backend
npm start
```

#### Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/updateprofile` - Actualizar perfil

### Productos
- `GET /api/products` - Listar productos (con filtros)
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/:id` - Actualizar producto (Admin)
- `DELETE /api/products/:id` - Eliminar producto (Admin)

### Pedidos
- `POST /api/orders` - Crear pedido
- `GET /api/orders/myorders` - Pedidos del usuario
- `GET /api/orders/:id` - Obtener pedido específico
- `GET /api/orders` - Todos los pedidos (Admin)
- `GET /api/orders/available` - Pedidos disponibles (Repartidor)
- `PUT /api/orders/:id/status` - Actualizar estado
- `PUT /api/orders/:id/assign` - Asignar repartidor (Admin)
- `PUT /api/orders/:id/take` - Tomar pedido (Repartidor)

## 👥 Roles de Usuario

### Cliente
- Ver catálogo y productos
- Agregar al carrito y comprar
- Ver historial de pedidos
- Hacer seguimiento en tiempo real

### Admin
- Todas las funciones de cliente
- Dashboard con estadísticas
- CRUD de productos
- Gestión de pedidos y usuarios
- Asignar repartidores

### Repartidor
- Ver pedidos disponibles
- Tomar pedidos
- Ver ruta en mapa
- Actualizar estado a "Entregado"

## 🎨 Estilo de Diseño

El diseño hereda el estilo del `index.html` original:
- **Modo oscuro**: `#0a0a0a`
- **Acentos amarillos**: `#facc15`
- **Tipografía**: Bangers para títulos, Poppins para texto
- **Glassmorphism** en navbar
- **Lenguaje informal y "fiestero"**
- **100% responsive** (Mobile First)

## 🔄 Socket.io - Tiempo Real

El sistema utiliza Socket.io para:
- Actualización de estado de pedidos
- Seguimiento de ubicación del repartidor
- Notificaciones instantáneas

## 📝 Notas de Desarrollo

- Los productos se almacenan en MongoDB con categorías predefinidas
- Los pedidos generan un número único automáticamente
- Las contraseñas se encriptan con bcrypt (10 rounds)
- JWT expira en 7 días por defecto
- El stock se actualiza automáticamente al crear pedidos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

## 👨‍💻 Autor

**DON CHUPILAS Team**

---

⚠️ **Advertencia**: El consumo excesivo de alcohol es perjudicial para la salud. Venta prohibida a menores de 18 años.