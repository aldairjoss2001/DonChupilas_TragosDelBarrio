import express from 'express';
import Message from '../models/Message.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get messages for an order
router.get('/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Verify order exists and user has access
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    
    // Check if user is client or assigned delivery driver
    if (order.cliente.toString() !== req.user._id.toString() && 
        order.repartidor?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes acceso a este chat' });
    }
    
    const messages = await Message.find({ pedido: orderId })
      .populate('remitente', 'nombre avatar')
      .sort({ createdAt: 1 });
      
    res.json(messages);
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Send a message
router.post('/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { mensaje } = req.body;
    
    if (!mensaje || mensaje.trim() === '') {
      return res.status(400).json({ message: 'El mensaje no puede estar vacío' });
    }
    
    // Verify order exists and user has access
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    
    // Determine sender type
    let tipoRemitente;
    if (order.cliente.toString() === req.user._id.toString()) {
      tipoRemitente = 'cliente';
    } else if (order.repartidor?.toString() === req.user._id.toString()) {
      tipoRemitente = 'repartidor';
    } else {
      return res.status(403).json({ message: 'No tienes acceso a este chat' });
    }
    
    const newMessage = await Message.create({
      pedido: orderId,
      remitente: req.user._id,
      tipoRemitente,
      mensaje: mensaje.trim()
    });
    
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('remitente', 'nombre avatar');
      
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
