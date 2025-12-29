# 🚀 Guía Rápida de Instalación - DON CHUPILAS

Esta guía te ayudará a poner en marcha el sistema completo en tu máquina local.

## ⚡ Instalación Rápida (5 minutos)

### 1. Prerrequisitos

Asegúrate de tener instalado:
- **Node.js** v16 o superior → [Descargar](https://nodejs.org/)
- **MongoDB** → [Descargar](https://www.mongodb.com/try/download/community) o usar [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** → [Descargar](https://git-scm.com/)

### 2. Clonar el repositorio

```bash
git clone https://github.com/aldairjoss2001/DonChupilas_TragosDelBarrio.git
cd DonChupilas_TragosDelBarrio
```

### 3. Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp ../.env.example .env

# Editar .env con tus configuraciones
nano .env  # o usa tu editor favorito
```

**Configuración mínima en `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/donchupilas
JWT_SECRET=tu_clave_super_secreta_123
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 4. Configurar Frontend

```bash
# Desde la raíz del proyecto
cd ../frontend

# Instalar dependencias
npm install
```

### 5. Iniciar el Sistema

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ El backend estará corriendo en `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ El frontend estará corriendo en `http://localhost:3000`

### 6. Verificar Instalación

1. Abre tu navegador en `http://localhost:3000`
2. Deberías ver la página de inicio de DON CHUPILAS
3. Ve a `http://localhost:5000` para verificar que la API responde:
   ```json
   {
     "message": "🍻 ¡Bienvenido a DON CHUPILAS API!",
     "version": "1.0.0",
     "status": "En línea"
   }
   ```

---

## 🎯 Primeros Pasos

### Crear un Usuario Admin

Puedes crear un usuario admin directamente desde la API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin",
    "email": "admin@donchupilas.com",
    "password": "admin123",
    "telefono": "555-0000",
    "rol": "admin"
  }'
```

O usa Postman/Thunder Client con:
- **URL**: `POST http://localhost:5000/api/auth/register`
- **Body (JSON)**:
```json
{
  "nombre": "Admin",
  "email": "admin@donchupilas.com",
  "password": "admin123",
  "telefono": "555-0000",
  "rol": "admin"
}
```

### Acceder al Panel Admin

1. Ve a `http://localhost:3000/login`
2. Inicia sesión con:
   - **Email**: `admin@donchupilas.com`
   - **Password**: `admin123`
3. Automáticamente serás redirigido a `/admin`

---

## 📦 Agregar Productos de Prueba

Puedes usar este script para agregar productos de prueba:

```bash
# Desde la carpeta backend
node scripts/seedProducts.js
```

O manualmente vía API (requiere token de admin):

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {tu_token_admin}" \
  -d '{
    "nombre": "Corona Extra 355ml",
    "descripcion": "Cerveza mexicana ligera",
    "precio": 25,
    "categoria": "cervezas",
    "stock": 100,
    "imagen": "https://images.unsplash.com/photo-1592318963771-067585090605",
    "destacado": true
  }'
```

---

## 🔧 Comandos Útiles

### Backend
```bash
npm run dev     # Modo desarrollo con nodemon
npm start       # Modo producción
```

### Frontend
```bash
npm run dev     # Servidor de desarrollo
npm run build   # Build para producción
npm run preview # Preview del build
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to MongoDB"
- Verifica que MongoDB esté corriendo: `mongod --version`
- Si usas MongoDB Atlas, verifica la URL de conexión en `.env`
- Asegúrate de que el puerto 27017 esté disponible

### Error: "Port 5000 already in use"
- Cambia el puerto en `.env`: `PORT=5001`
- O detén el proceso que usa el puerto: `lsof -ti:5000 | xargs kill`

### Error: "Module not found"
- Elimina `node_modules` y reinstala:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Frontend no se conecta al Backend
- Verifica que el backend esté corriendo en el puerto 5000
- Revisa la configuración de proxy en `frontend/vite.config.js`
- Abre las herramientas de desarrollador (F12) y revisa la consola

---

## 📱 Probar en Dispositivos Móviles

1. Obtén tu IP local:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Actualiza `FRONTEND_URL` en `.env`:
   ```env
   FRONTEND_URL=http://192.168.1.X:3000
   ```

3. Accede desde tu móvil a:
   - Frontend: `http://192.168.1.X:3000`
   - Backend: `http://192.168.1.X:5000`

---

## 🚀 Despliegue a Producción

### Backend (Railway/Heroku/DigitalOcean)

1. Configura las variables de entorno
2. Conecta tu base de datos MongoDB Atlas
3. Despliega:
   ```bash
   git push heroku main
   ```

### Frontend (Vercel/Netlify)

1. Build del proyecto:
   ```bash
   cd frontend
   npm run build
   ```

2. Despliega la carpeta `dist/`

3. Actualiza la URL del backend en variables de entorno

---

## 📚 Documentación Adicional

- [README.md](./README.md) - Documentación general
- [STRUCTURE.md](./STRUCTURE.md) - Arquitectura del sistema
- [API_DOCS.md](./API_DOCS.md) - Documentación de endpoints

---

## 🆘 Soporte

¿Problemas? Abre un issue en el repositorio:
https://github.com/aldairjoss2001/DonChupilas_TragosDelBarrio/issues

---

¡Listo! Ya tienes **DON CHUPILAS** corriendo localmente. 🍻

**Próximo paso**: Explora el panel admin en `/admin` y comienza a agregar productos.
