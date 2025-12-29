import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  numeroPedido: {
    type: String,
    unique: true,
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productos: [{
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    nombre: String,
    imagen: String,
    cantidad: {
      type: Number,
      required: true,
      min: [1, 'La cantidad mínima es 1']
    },
    precio: {
      type: Number,
      required: true
    }
  }],
  direccionEntrega: {
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    colonia: String,
    ciudad: { type: String, required: true },
    codigoPostal: String,
    referencias: String,
    coordenadas: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  impuestos: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  costoEnvio: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  metodoPago: {
    type: String,
    required: true,
    enum: ['efectivo', 'transferencia', 'tarjeta']
  },
  estado: {
    type: String,
    required: true,
    enum: ['recibido', 'preparando', 'en_camino', 'entregado', 'cancelado'],
    default: 'recibido'
  },
  repartidor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tiempoEstimado: {
    type: Number, // minutos
    default: 30
  },
  fechaEntregaEstimada: {
    type: Date
  },
  fechaEntregaReal: {
    type: Date
  },
  calificacion: {
    puntuacion: {
      type: Number,
      min: 1,
      max: 5
    },
    comentario: String,
    fecha: Date
  },
  historialEstados: [{
    estado: String,
    fecha: {
      type: Date,
      default: Date.now
    },
    nota: String
  }],
  notasEspeciales: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

// Generar número de pedido antes de guardar
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const fecha = new Date();
    const year = fecha.getFullYear().toString().slice(-2);
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    
    // Contar pedidos del día
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()),
        $lt: new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1)
      }
    });
    
    this.numeroPedido = `DC${year}${month}${day}-${(count + 1).toString().padStart(4, '0')}`;
    
    // Agregar al historial
    this.historialEstados.push({
      estado: this.estado,
      fecha: new Date()
    });
  }
  next();
});

// Middleware para actualizar historial cuando cambia el estado
orderSchema.pre('save', function(next) {
  if (this.isModified('estado') && !this.isNew) {
    this.historialEstados.push({
      estado: this.estado,
      fecha: new Date()
    });
    
    if (this.estado === 'entregado') {
      this.fechaEntregaReal = new Date();
    }
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
