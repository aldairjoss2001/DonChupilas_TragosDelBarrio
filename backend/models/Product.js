import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  precioDescuento: {
    type: Number,
    min: [0, 'El precio con descuento no puede ser negativo']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['cervezas', 'destilados', 'vinos', 'snacks', 'hielos', 'mezcladores', 'combos']
  },
  subcategoria: {
    type: String,
    trim: true
  },
  imagen: {
    type: String,
    default: 'https://via.placeholder.com/400?text=Producto'
  },
  imagenes: [{
    type: String
  }],
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  stockMinimo: {
    type: Number,
    default: 5
  },
  marca: {
    type: String,
    trim: true
  },
  volumen: {
    type: String,
    trim: true
  },
  graduacionAlcoholica: {
    type: Number,
    min: 0,
    max: 100
  },
  destacado: {
    type: Boolean,
    default: false
  },
  activo: {
    type: Boolean,
    default: true
  },
  ventas: {
    type: Number,
    default: 0
  },
  calificacionPromedio: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numeroCalificaciones: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índice para búsqueda por texto
productSchema.index({ nombre: 'text', descripcion: 'text' });

// Virtual para verificar si el stock está bajo
productSchema.virtual('stockBajo').get(function() {
  return this.stock <= this.stockMinimo;
});

const Product = mongoose.model('Product', productSchema);

export default Product;
