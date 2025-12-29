import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { Server } from 'socket.io';
import { createServer } from 'http';

import connectDB from './config/db.js';
import { errorHandler } from './middleware/error.js';

// Rutas
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io para actualizaciones en tiempo real
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);

  // Join room para pedido específico
  socket.on('join-order', (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`👤 Cliente unido a order-${orderId}`);
  });

  // Actualización de estado de pedido
  socket.on('order-status-update', (data) => {
    io.to(`order-${data.orderId}`).emit('status-changed', data);
  });

  // Actualización de ubicación de repartidor
  socket.on('location-update', (data) => {
    io.to(`order-${data.orderId}`).emit('delivery-location', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado:', socket.id);
  });
});

// Hacer io accesible en las rutas
app.set('io', io);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🍻 ¡Bienvenido a DON CHUPILAS API!', 
    version: '1.0.0',
    status: 'En línea'
  });
});

// Manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   🍻  DON CHUPILAS API - Servidor en línea  🍻       ║
  ║                                                       ║
  ║   Puerto: ${PORT}                                      ║
  ║   Modo: ${process.env.NODE_ENV || 'development'}                              ║
  ║   Socket.io: Activo ✅                                ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
});

// Manejo de rechazos de promesas no controladas
process.on('unhandledRejection', (err) => {
  console.log(`❌ Error: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

export default app;
