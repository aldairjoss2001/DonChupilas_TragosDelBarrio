import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email no válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true
  },
  rol: {
    type: String,
    enum: ['cliente', 'admin', 'repartidor'],
    default: 'cliente'
  },
  direcciones: [{
    alias: String,
    calle: String,
    numero: String,
    colonia: String,
    ciudad: String,
    codigoPostal: String,
    referencias: String,
    coordenadas: {
      lat: Number,
      lng: Number
    }
  }],
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  ubicacionPredeterminada: {
    lat: {
      type: Number,
      default: 19.4326
    },
    lng: {
      type: Number,
      default: -99.1332
    }
  },
  activo: {
    type: Boolean,
    default: true
  },
  // Para repartidores
  vehiculo: {
    type: String,
    enum: ['moto', 'auto', 'bicicleta', 'otro'],
    required: function() { return this.rol === 'repartidor'; }
  },
  disponible: {
    type: Boolean,
    default: false
  },
  pedidosEntregados: {
    type: Number,
    default: 0
  },
  calificacionPromedio: {
    type: Number,
    default: 5,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

// Hash password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar passwords
userSchema.methods.compararPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
