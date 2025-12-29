# 📡 Documentación de API - DON CHUPILAS

Base URL: `http://localhost:5000/api`

## 🔐 Autenticación

Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer {token}
```

---

## 👤 Auth Endpoints

### Registrar Usuario
```http
POST /auth/register
```

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "telefono": "555-1234",
  "rol": "cliente"  // opcional: cliente, admin, repartidor
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "555-1234",
    "rol": "cliente",
    "avatar": "https://via.placeholder.com/150"
  }
}
```

**Errores:**
- `400` - Email ya registrado
- `400` - Datos de validación incorrectos

---

### Iniciar Sesión
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "cliente"
  }
}
```

**Errores:**
- `400` - Email y contraseña requeridos
- `401` - Credenciales inválidas

---

### Obtener Usuario Actual
```http
GET /auth/me
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "555-1234",
    "rol": "cliente",
    "direcciones": [],
    "avatar": "https://via.placeholder.com/150"
  }
}
```

---

### Actualizar Perfil
```http
PUT /auth/updateprofile
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Juan Carlos Pérez",
  "telefono": "555-5678",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "¡Perfil actualizado, Don!",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Carlos Pérez",
    "telefono": "555-5678"
  }
}
```

---

## 🍺 Products Endpoints

### Listar Productos
```http
GET /products?categoria=cervezas&search=corona&destacado=true
```

**Query Parameters:**
- `categoria` - Filtrar por categoría (cervezas, destilados, vinos, snacks, etc.)
- `search` - Búsqueda de texto en nombre y descripción
- `destacado` - true/false para productos destacados
- `activo` - true/false (default: true)

**Respuesta (200):**
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "_id": "507f191e810c19729de860ea",
      "nombre": "Corona Extra 355ml",
      "descripcion": "Cerveza mexicana ligera y refrescante",
      "precio": 25.00,
      "precioDescuento": 22.00,
      "categoria": "cervezas",
      "imagen": "https://example.com/corona.jpg",
      "stock": 50,
      "marca": "Corona",
      "volumen": "355ml",
      "graduacionAlcoholica": 4.5,
      "destacado": true,
      "ventas": 125,
      "calificacionPromedio": 4.5,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Obtener Producto
```http
GET /products/:id
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f191e810c19729de860ea",
    "nombre": "Corona Extra 355ml",
    "descripcion": "Cerveza mexicana ligera y refrescante",
    "precio": 25.00,
    "stock": 50,
    "categoria": "cervezas"
  }
}
```

**Errores:**
- `404` - Producto no encontrado

---

### Crear Producto (Admin)
```http
POST /products
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Whisky Black Label 750ml",
  "descripcion": "Whisky escocés premium",
  "precio": 450.00,
  "categoria": "destilados",
  "subcategoria": "whisky",
  "imagen": "https://example.com/blacklabel.jpg",
  "stock": 20,
  "stockMinimo": 5,
  "marca": "Johnnie Walker",
  "volumen": "750ml",
  "graduacionAlcoholica": 40,
  "destacado": true
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "¡Producto agregado al catálogo, Don!",
  "data": {
    "_id": "507f191e810c19729de860eb",
    "nombre": "Whisky Black Label 750ml",
    "precio": 450.00,
    "stock": 20
  }
}
```

**Errores:**
- `401` - No autorizado
- `403` - Acceso denegado (no es admin)

---

### Actualizar Producto (Admin)
```http
PUT /products/:id
Authorization: Bearer {token}
```

**Body:**
```json
{
  "precio": 420.00,
  "stock": 25,
  "destacado": false
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "¡Producto actualizado, Don!",
  "data": {
    "_id": "507f191e810c19729de860eb",
    "nombre": "Whisky Black Label 750ml",
    "precio": 420.00,
    "stock": 25
  }
}
```

---

### Eliminar Producto (Admin)
```http
DELETE /products/:id
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "¡Producto eliminado del catálogo, Don!",
  "data": {}
}
```

---

## 📦 Orders Endpoints

### Crear Pedido
```http
POST /orders
Authorization: Bearer {token}
```

**Body:**
```json
{
  "productos": [
    {
      "producto": "507f191e810c19729de860ea",
      "nombre": "Corona Extra 355ml",
      "imagen": "https://example.com/corona.jpg",
      "cantidad": 6,
      "precio": 25.00
    }
  ],
  "direccionEntrega": {
    "calle": "Av. Reforma",
    "numero": "123",
    "colonia": "Centro",
    "ciudad": "Ciudad de México",
    "codigoPostal": "06000",
    "referencias": "Casa azul, portón negro",
    "coordenadas": {
      "lat": 19.4326,
      "lng": -99.1332
    }
  },
  "subtotal": 150.00,
  "impuestos": 24.00,
  "costoEnvio": 50.00,
  "total": 224.00,
  "metodoPago": "efectivo",
  "notasEspeciales": "Tocar el timbre 3 veces"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "¡Pedido recibido! Tu hidratación va en camino, Don.",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "numeroPedido": "DC241215-0001",
    "cliente": {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Juan Pérez",
      "telefono": "555-1234"
    },
    "productos": [...],
    "estado": "recibido",
    "total": 224.00,
    "fechaEntregaEstimada": "2024-12-15T11:30:00.000Z"
  }
}
```

**Errores:**
- `400` - Stock insuficiente
- `404` - Producto no existe

---

### Obtener Mis Pedidos
```http
GET /orders/myorders
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "numeroPedido": "DC241215-0001",
      "productos": [...],
      "total": 224.00,
      "estado": "en_camino",
      "repartidor": {
        "nombre": "Carlos López",
        "telefono": "555-9876"
      },
      "createdAt": "2024-12-15T10:00:00.000Z"
    }
  ]
}
```

---

### Obtener Pedido Específico
```http
GET /orders/:id
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "numeroPedido": "DC241215-0001",
    "cliente": {...},
    "productos": [...],
    "direccionEntrega": {...},
    "estado": "en_camino",
    "repartidor": {...},
    "historialEstados": [
      {
        "estado": "recibido",
        "fecha": "2024-12-15T10:00:00.000Z"
      },
      {
        "estado": "preparando",
        "fecha": "2024-12-15T10:15:00.000Z"
      },
      {
        "estado": "en_camino",
        "fecha": "2024-12-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### Obtener Todos los Pedidos (Admin)
```http
GET /orders?estado=recibido
Authorization: Bearer {token}
```

**Query Parameters:**
- `estado` - Filtrar por estado (recibido, preparando, en_camino, entregado, cancelado)

**Respuesta (200):**
```json
{
  "success": true,
  "count": 8,
  "data": [...]
}
```

---

### Obtener Pedidos Disponibles (Repartidor)
```http
GET /orders/available
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "numeroPedido": "DC241215-0001",
      "cliente": {
        "nombre": "Juan Pérez",
        "telefono": "555-1234"
      },
      "direccionEntrega": {...},
      "total": 224.00,
      "estado": "recibido",
      "tiempoEstimado": 30
    }
  ]
}
```

---

### Actualizar Estado del Pedido
```http
PUT /orders/:id/status
Authorization: Bearer {token}
```

**Body:**
```json
{
  "estado": "entregado"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "¡Estado actualizado a entregado!",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "estado": "entregado",
    "fechaEntregaReal": "2024-12-15T11:15:00.000Z"
  }
}
```

---

### Asignar Repartidor (Admin)
```http
PUT /orders/:id/assign
Authorization: Bearer {token}
```

**Body:**
```json
{
  "repartidorId": "507f1f77bcf86cd799439013"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "¡Repartidor asignado!",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "estado": "preparando",
    "repartidor": {
      "nombre": "Carlos López",
      "telefono": "555-9876"
    }
  }
}
```

---

### Tomar Pedido (Repartidor)
```http
PUT /orders/:id/take
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "¡Pedido asignado! A entregar, Don.",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "estado": "en_camino",
    "repartidor": "507f1f77bcf86cd799439013"
  }
}
```

**Errores:**
- `400` - Pedido ya tiene repartidor

---

## 🔌 WebSocket Events

### Conectar
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Conectado:', socket.id);
});
```

### Unirse a Sala de Pedido
```javascript
socket.emit('join-order', orderId);
```

### Escuchar Cambios de Estado
```javascript
socket.on('status-changed', (data) => {
  console.log('Nuevo estado:', data.estado);
  // data: { orderId, estado, fecha }
});
```

### Actualizar Estado (Repartidor/Admin)
```javascript
socket.emit('order-status-update', {
  orderId: '507f1f77bcf86cd799439012',
  estado: 'en_camino',
  fecha: new Date()
});
```

### Actualizar Ubicación (Repartidor)
```javascript
socket.emit('location-update', {
  orderId: '507f1f77bcf86cd799439012',
  lat: 19.4326,
  lng: -99.1332
});
```

### Escuchar Ubicación (Cliente)
```javascript
socket.on('delivery-location', (data) => {
  console.log('Ubicación del repartidor:', data);
  // data: { orderId, lat, lng }
});
```

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

## 📝 Notas

- Todos los precios son en la moneda local
- Las fechas están en formato ISO 8601
- El stock se actualiza automáticamente al crear pedidos
- Los números de pedido se generan automáticamente: `DC{YYMMDD}-{0001}`
- Los tokens JWT expiran en 7 días por defecto

## 🧪 Testing con cURL

### Registrar usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Test",
    "email": "juan@test.com",
    "password": "test123",
    "telefono": "555-0000"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@test.com",
    "password": "test123"
  }'
```

### Listar productos
```bash
curl http://localhost:5000/api/products
```

### Crear producto (requiere token)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {tu-token}" \
  -d '{
    "nombre": "Cerveza Test",
    "descripcion": "Cerveza de prueba",
    "precio": 25,
    "categoria": "cervezas",
    "stock": 100
  }'
```
