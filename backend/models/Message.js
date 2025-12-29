import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  pedido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  remitente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tipoRemitente: {
    type: String,
    enum: ['cliente', 'repartidor'],
    required: true
  },
  mensaje: {
    type: String,
    required: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
