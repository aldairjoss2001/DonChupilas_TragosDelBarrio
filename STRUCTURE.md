# 📐 Estructura del Proyecto DON CHUPILAS

Este documento describe en detalle la arquitectura y organización del sistema web MERN Stack de DON CHUPILAS.

## 📊 Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Cliente    │  │    Admin     │  │  Repartidor  │      │
│  │  React App   │  │  Dashboard   │  │     App      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          │     HTTP/REST    │    WebSocket     │
          ├──────────────────┴──────────────────┤
          │                                     │
┌─────────▼─────────────────────────────────────▼─────────────┐
│                    BACKEND (Node.js)                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Express   │  │ Socket.io  │  │    JWT     │            │
│  │   Server   │  │   Events   │  │    Auth    │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
└────────┼───────────────┼───────────────┼────────────────────┘
         │               │               │
         └───────────────┴───────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                    MongoDB (Database)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Users   │  │ Products │  │  Orders  │  │   Logs   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└──────────────────────────────────────────────────────────────┘
```

## 🗂️ Estructura de Directorios

### Backend

```
backend/
├── config/
│   └── db.js                    # Configuración y conexión a MongoDB
│
├── controllers/                 # Lógica de negocio
│   ├── authController.js        # Autenticación (login, register, perfil)
│   ├── productController.js     # CRUD de productos
│   └── orderController.js       # Gestión de pedidos
│
├── middleware/                  # Funciones intermedias
│   ├── auth.js                  # Protección de rutas con JWT
│   └── error.js                 # Manejo global de errores
│
├── models/                      # Esquemas de Mongoose
│   ├── User.js                  # Usuario (cliente/admin/repartidor)
│   ├── Product.js               # Producto (licores, snacks, etc.)
│   └── Order.js                 # Pedido con historial de estados
│
├── routes/                      # Definición de endpoints
│   ├── auth.js                  # /api/auth/*
│   ├── products.js              # /api/products/*
│   └── orders.js                # /api/orders/*
│
├── utils/                       # Utilidades
│   └── jwt.js                   # Generación y validación de tokens
│
├── server.js                    # Punto de entrada del servidor
└── package.json                 # Dependencias del backend
```

### Frontend

```
frontend/
├── public/
│   └── logoprincipal_1.png     # Logo de la aplicación
│
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── common/              # Compartidos
│   │   │   ├── Navbar.jsx       # Barra de navegación glassmorphism
│   │   │   ├── Footer.jsx       # Pie de página con redes sociales
│   │   │   ├── Button.jsx       # (Pendiente) Botón estilizado
│   │   │   └── Card.jsx         # (Pendiente) Card de producto
│   │   │
│   │   ├── admin/               # Específicos de Admin
│   │   │   ├── AdminSidebar.jsx # Sidebar del panel admin
│   │   │   ├── ProductForm.jsx  # (Pendiente) Formulario de producto
│   │   │   └── OrderTable.jsx   # (Pendiente) Tabla de pedidos
│   │   │
│   │   ├── delivery/            # Específicos de Repartidor
│   │   │   ├── DeliverySidebar.jsx # Sidebar del repartidor
│   │   │   ├── OrderCard.jsx    # (Pendiente) Card de pedido
│   │   │   └── Map.jsx          # (Pendiente) Mapa con Leaflet
│   │   │
│   │   └── layouts/             # Layouts principales
│   │       ├── ClientLayout.jsx # Layout para clientes
│   │       ├── AdminLayout.jsx  # Layout para admin
│   │       └── DeliveryLayout.jsx # Layout para repartidor
│   │
│   ├── context/                 # Contextos de React
│   │   ├── AuthContext.jsx      # Autenticación global
│   │   ├── CartContext.jsx      # (Pendiente) Carrito de compras
│   │   └── SocketContext.jsx    # (Pendiente) WebSocket
│   │
│   ├── pages/                   # Páginas de la aplicación
│   │   ├── auth/                # Autenticación
│   │   │   ├── Login.jsx        # Inicio de sesión
│   │   │   └── Register.jsx     # Registro de usuario
│   │   │
│   │   ├── client/              # Páginas de cliente
│   │   │   ├── Home.jsx         # Página de inicio
│   │   │   ├── Catalog.jsx      # Catálogo con filtros
│   │   │   ├── ProductDetail.jsx # Detalle de producto
│   │   │   ├── Cart.jsx         # Carrito de compras
│   │   │   ├── Checkout.jsx     # Proceso de pago
│   │   │   ├── OrderTracking.jsx # Tracking en tiempo real
│   │   │   └── MyOrders.jsx     # Historial de pedidos
│   │   │
│   │   ├── admin/               # Páginas de admin
│   │   │   ├── Dashboard.jsx    # Dashboard con estadísticas
│   │   │   ├── Products.jsx     # Gestión de productos
│   │   │   ├── Orders.jsx       # Gestión de pedidos
│   │   │   └── Users.jsx        # Gestión de usuarios
│   │   │
│   │   └── delivery/            # Páginas de repartidor
│   │       ├── Dashboard.jsx    # Dashboard del repartidor
│   │       ├── Orders.jsx       # Pedidos disponibles
│   │       └── Route.jsx        # Ruta de entrega con mapa
│   │
│   ├── services/                # Servicios API
│   │   ├── productService.js    # Llamadas a /api/products
│   │   └── orderService.js      # Llamadas a /api/orders
│   │
│   ├── hooks/                   # Custom Hooks
│   │   ├── useAuth.js           # (Pendiente) Hook de autenticación
│   │   ├── useCart.js           # (Pendiente) Hook del carrito
│   │   └── useSocket.js         # (Pendiente) Hook de WebSocket
│   │
│   ├── utils/                   # Funciones utilitarias
│   │   ├── formatters.js        # (Pendiente) Formateo de datos
│   │   └── validators.js        # (Pendiente) Validaciones
│   │
│   ├── App.jsx                  # Componente principal con rutas
│   ├── main.jsx                 # Punto de entrada de React
│   └── index.css                # Estilos globales
│
├── index.html                   # HTML base
├── package.json                 # Dependencias del frontend
├── vite.config.js               # Configuración de Vite
├── tailwind.config.js           # Configuración de Tailwind
└── postcss.config.js            # Configuración de PostCSS
```

## 🔄 Flujo de Datos

### 1. Autenticación
```
Usuario → Login Form → POST /api/auth/login → JWT Token
         ↓
    localStorage + AuthContext + axios.defaults.headers
         ↓
    Protege rutas con middleware 'protect'
```

### 2. Catálogo y Compra
```
1. GET /api/products?categoria=cervezas → Lista de productos
2. Usuario selecciona productos → Agrega al carrito (Context)
3. Checkout → POST /api/orders → Crea pedido
4. Stock actualizado automáticamente
5. Socket.io emite 'new-order' → Admin notificado
```

### 3. Seguimiento de Pedido
```
1. Socket.io: cliente se une a 'order-{id}'
2. Admin/Repartidor actualiza estado
3. PUT /api/orders/{id}/status
4. Socket.io emite 'status-changed' → Cliente actualiza UI
5. Repartidor envía ubicación → Socket.io → Mapa del cliente
```

## 🗄️ Modelos de Base de Datos

### User Schema
```javascript
{
  nombre: String,
  email: String (unique),
  password: String (hashed),
  telefono: String,
  rol: ['cliente', 'admin', 'repartidor'],
  direcciones: [{
    alias, calle, numero, coordenadas {lat, lng}
  }],
  // Para repartidores:
  vehiculo: String,
  disponible: Boolean,
  pedidosEntregados: Number,
  calificacionPromedio: Number
}
```

### Product Schema
```javascript
{
  nombre: String,
  descripcion: String,
  precio: Number,
  precioDescuento: Number,
  categoria: ['cervezas', 'destilados', 'vinos', 'snacks', ...],
  imagen: String,
  stock: Number,
  stockMinimo: Number,
  marca: String,
  volumen: String,
  graduacionAlcoholica: Number,
  destacado: Boolean,
  ventas: Number,
  calificacionPromedio: Number
}
```

### Order Schema
```javascript
{
  numeroPedido: String (auto-generado),
  cliente: ObjectId → User,
  productos: [{
    producto: ObjectId → Product,
    cantidad: Number,
    precio: Number
  }],
  direccionEntrega: {
    calle, numero, coordenadas {lat, lng}
  },
  subtotal: Number,
  impuestos: Number,
  costoEnvio: Number,
  total: Number,
  metodoPago: ['efectivo', 'transferencia', 'tarjeta'],
  estado: ['recibido', 'preparando', 'en_camino', 'entregado'],
  repartidor: ObjectId → User,
  historialEstados: [{
    estado, fecha, nota
  }],
  calificacion: { puntuacion, comentario }
}
```

## 🔐 Autenticación y Autorización

### JWT Flow
1. Usuario envía credenciales
2. Backend valida y genera JWT
3. Frontend almacena token en localStorage
4. Token se envía en header `Authorization: Bearer {token}`
5. Middleware `protect` verifica token en cada petición

### Roles y Permisos
- **Cliente**: Ver productos, crear pedidos, ver sus pedidos
- **Admin**: Todas las funciones + CRUD de productos + gestión de usuarios
- **Repartidor**: Ver pedidos disponibles, tomar pedidos, actualizar estados

## 🌐 API Endpoints

### Autenticación (`/api/auth`)
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| POST | `/register` | Público | Registrar usuario |
| POST | `/login` | Público | Iniciar sesión |
| GET | `/me` | Privado | Obtener usuario actual |
| PUT | `/updateprofile` | Privado | Actualizar perfil |

### Productos (`/api/products`)
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | `/` | Público | Listar productos (con filtros) |
| GET | `/:id` | Público | Obtener producto |
| POST | `/` | Admin | Crear producto |
| PUT | `/:id` | Admin | Actualizar producto |
| DELETE | `/:id` | Admin | Eliminar producto |

### Pedidos (`/api/orders`)
| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| POST | `/` | Cliente | Crear pedido |
| GET | `/myorders` | Cliente | Mis pedidos |
| GET | `/:id` | Privado | Obtener pedido |
| GET | `/` | Admin | Todos los pedidos |
| GET | `/available` | Repartidor | Pedidos disponibles |
| PUT | `/:id/status` | Admin/Repartidor | Actualizar estado |
| PUT | `/:id/assign` | Admin | Asignar repartidor |
| PUT | `/:id/take` | Repartidor | Tomar pedido |

## 🎨 Guía de Estilos

### Colores
- **Fondo oscuro**: `#0a0a0a` (bg-[#0a0a0a])
- **Fondo más oscuro**: `#050505` (bg-[#050505])
- **Amarillo primario**: `#facc15` (text-yellow-500)
- **Amarillo dorado**: `#eab308` (text-yellow-400)

### Tipografía
- **Títulos**: Bangers (font-bangers)
- **Texto**: Poppins (font-poppins)

### Componentes Clave
- **Glassmorphism**: `backdrop-filter: blur(12px)`
- **Neon Text**: `text-shadow: 0 0 10px #facc15`
- **Animations**: Animate.css + custom floating
- **Hover Effects**: `transform: scale(1.05) translateY(-2px)`

### Lenguaje
Informal, directo y "fiestero":
- ✅ "¡Ya casi llega tu hidratación!"
- ✅ "¡Uy! Te quedaste sin stock, Don."
- ✅ "¿Qué te ofrecemos?"
- ❌ "Su pedido está en camino"

## 🔌 Socket.io Events

### Cliente
- `join-order` - Unirse a sala de pedido
- `status-changed` - Recibir cambio de estado
- `delivery-location` - Recibir ubicación de repartidor

### Servidor
- `order-status-update` - Emitir cambio de estado
- `location-update` - Emitir ubicación de repartidor

## 📱 Responsive Design

Mobile First approach:
- **Mobile**: < 768px (cols-1)
- **Tablet**: 768px - 1024px (cols-2)
- **Desktop**: > 1024px (cols-3+)

Breakpoints de Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🚀 Próximos Pasos

### Pendientes de Implementación
1. **Catálogo completo** con filtros funcionales
2. **Carrito Context** para persistencia
3. **Integración de mapas** (Leaflet/Mapbox)
4. **Gráficas** en Dashboard Admin (Chart.js)
5. **WebSocket** completo para tracking
6. **Validaciones de formularios** mejoradas
7. **Subida de imágenes** de productos
8. **Sistema de calificaciones**
9. **Notificaciones push**
10. **Tests unitarios** y de integración

### Optimizaciones Futuras
- Caché de productos (React Query)
- Lazy loading de imágenes
- Code splitting por rutas
- PWA para app móvil
- Server-side rendering (Next.js)
