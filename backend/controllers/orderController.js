import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Crear nuevo pedido
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      productos,
      direccionEntrega,
      subtotal,
      impuestos,
      costoEnvio,
      total,
      metodoPago,
      notasEspeciales
    } = req.body;

    // Verificar stock de productos
    for (const item of productos) {
      const product = await Product.findById(item.producto);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `¡Uy! El producto ${item.nombre} no existe.`
        });
      }
      if (product.stock < item.cantidad) {
        return res.status(400).json({
          success: false,
          message: `¡Uy! No hay suficiente stock de ${product.nombre}. Solo quedan ${product.stock} unidades.`
        });
      }
    }

    // Crear pedido
    const order = await Order.create({
      cliente: req.user.id,
      productos,
      direccionEntrega,
      subtotal,
      impuestos,
      costoEnvio,
      total,
      metodoPago,
      notasEspeciales,
      fechaEntregaEstimada: new Date(Date.now() + 30 * 60000) // 30 minutos
    });

    // Actualizar stock y ventas de productos
    for (const item of productos) {
      await Product.findByIdAndUpdate(item.producto, {
        $inc: { stock: -item.cantidad, ventas: item.cantidad }
      });
    }

    const orderPopulated = await Order.findById(order._id)
      .populate('cliente', 'nombre telefono email')
      .populate('productos.producto');

    res.status(201).json({
      success: true,
      message: '¡Pedido recibido! Tu hidratación va en camino, Don.',
      data: orderPopulated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener pedidos del usuario
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ cliente: req.user.id })
      .populate('repartidor', 'nombre telefono calificacionPromedio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener un pedido específico
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('cliente', 'nombre telefono email')
      .populate('repartidor', 'nombre telefono vehiculo calificacionPromedio')
      .populate('productos.producto');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '¡Uy! Ese pedido no existe, Don.'
      });
    }

    // Verificar que el usuario sea el dueño o admin/repartidor
    if (
      order.cliente._id.toString() !== req.user.id &&
      req.user.rol !== 'admin' &&
      (req.user.rol !== 'repartidor' || order.repartidor?.toString() !== req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: '¡Alto ahí! No tienes acceso a este pedido.'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todos los pedidos (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { estado } = req.query;
    
    let query = {};
    if (estado) {
      query.estado = estado;
    }

    const orders = await Order.find(query)
      .populate('cliente', 'nombre telefono')
      .populate('repartidor', 'nombre telefono')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar estado del pedido
// @route   PUT /api/orders/:id/status
// @access  Private/Admin/Repartidor
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { estado } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '¡Uy! Ese pedido no existe, Don.'
      });
    }

    order.estado = estado;
    await order.save();

    res.status(200).json({
      success: true,
      message: `¡Estado actualizado a ${estado}!`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Asignar repartidor a pedido
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
export const assignDelivery = async (req, res, next) => {
  try {
    const { repartidorId } = req.body;

    const repartidor = await User.findById(repartidorId);
    if (!repartidor || repartidor.rol !== 'repartidor') {
      return res.status(404).json({
        success: false,
        message: '¡Uy! Ese repartidor no existe.'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { repartidor: repartidorId, estado: 'preparando' },
      { new: true }
    ).populate('repartidor', 'nombre telefono');

    res.status(200).json({
      success: true,
      message: '¡Repartidor asignado!',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pedidos disponibles para repartidores
// @route   GET /api/orders/available
// @access  Private/Repartidor
export const getAvailableOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      estado: { $in: ['recibido', 'preparando'] },
      repartidor: { $exists: false }
    })
      .populate('cliente', 'nombre telefono')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tomar pedido (Repartidor)
// @route   PUT /api/orders/:id/take
// @access  Private/Repartidor
export const takeOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '¡Uy! Ese pedido no existe.'
      });
    }

    if (order.repartidor) {
      return res.status(400).json({
        success: false,
        message: '¡Uy! Este pedido ya tiene repartidor asignado.'
      });
    }

    order.repartidor = req.user.id;
    order.estado = 'en_camino';
    await order.save();

    res.status(200).json({
      success: true,
      message: '¡Pedido asignado! A entregar, Don.',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calificar pedido
// @route   POST /api/orders/:id/rating
// @access  Private/Cliente
export const rateOrder = async (req, res, next) => {
  try {
    const { puntuacion, comentario } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '¡Uy! Ese pedido no existe.'
      });
    }

    // Verificar que el pedido pertenece al cliente
    if (order.cliente.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para calificar este pedido.'
      });
    }

    // Verificar que el pedido esté entregado
    if (order.estado !== 'entregado') {
      return res.status(400).json({
        success: false,
        message: 'Solo puedes calificar pedidos entregados.'
      });
    }

    // Verificar que no haya sido calificado previamente
    if (order.calificacion) {
      return res.status(400).json({
        success: false,
        message: 'Este pedido ya ha sido calificado.'
      });
    }

    // Validar puntuación
    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({
        success: false,
        message: 'La calificación debe ser entre 1 y 5.'
      });
    }

    // Agregar calificación al pedido
    order.calificacion = {
      puntuacion,
      comentario: comentario || '',
      fecha: new Date()
    };
    await order.save();

    // Actualizar calificación promedio del repartidor
    if (order.repartidor) {
      const repartidor = await User.findById(order.repartidor);
      if (repartidor) {
        // Obtener todas las calificaciones del repartidor
        const pedidosCalificados = await Order.find({
          repartidor: order.repartidor,
          'calificacion.puntuacion': { $exists: true }
        });

        const totalCalificaciones = pedidosCalificados.length;
        const sumaCalificaciones = pedidosCalificados.reduce(
          (sum, pedido) => sum + pedido.calificacion.puntuacion,
          0
        );

        repartidor.calificacionPromedio = sumaCalificaciones / totalCalificaciones;
        await repartidor.save();
      }
    }

    res.status(200).json({
      success: true,
      message: '¡Gracias por tu calificación!',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
