import { useState } from 'react';
import { Star, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RatingModal = ({ order, onClose, onRated }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`/api/orders/${order._id}/rating`, {
        puntuacion: rating,
        comentario: comment
      });
      
      toast.success('¡Gracias por tu calificación, Don!');
      onRated();
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Error al enviar la calificación');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
      <div className="bg-zinc-900 rounded-2xl max-w-md w-full border border-yellow-500/20">
        {/* Header */}
        <div className="p-6 border-b border-yellow-500/20 flex justify-between items-center">
          <h2 className="text-2xl font-bangers text-yellow-500">CALIFICA TU ENTREGA</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Order Info */}
          <div className="mb-6 p-4 bg-zinc-800 rounded-lg">
            <p className="text-gray-400 text-sm mb-1">Pedido</p>
            <p className="text-yellow-500 font-bold">#{order.numeroPedido}</p>
            {order.repartidor && (
              <p className="text-gray-400 text-sm mt-2">
                Repartidor: {order.repartidor.nombre}
              </p>
            )}
          </div>

          {/* Rating Stars */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-3">¿Cómo fue tu experiencia?</p>
            <div className="flex gap-2 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-gray-600'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <div className="text-center">
              {rating > 0 && (
                <p className="text-yellow-500 font-bold">
                  {rating === 1 && '😞 Malo'}
                  {rating === 2 && '😐 Regular'}
                  {rating === 3 && '🙂 Bueno'}
                  {rating === 4 && '😊 Muy Bueno'}
                  {rating === 5 && '🤩 Excelente'}
                </p>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-yellow-500 focus:outline-none resize-none"
              placeholder="Cuéntanos sobre tu experiencia..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className={`flex-1 px-4 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition font-bold ${
                (submitting || rating === 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Enviando...' : 'Enviar Calificación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
