import { useState, useContext, useEffect, useRef } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { createOrder } from '../../services/orderService';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, DollarSign, QrCode, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import OrderReceipt from '../../components/common/OrderReceipt';

const Checkout = () => {
  const { cartItems, clearCart, getSubtotal, getTax, getTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const receiptRef = useRef();

  // Form state
  const [formData, setFormData] = useState({
    calle: '',
    numero: '',
    colonia: '',
    ciudad: '',
    codigoPostal: '',
    referencias: '',
    lat: 19.432608, // Default coordinates (Mexico City)
    lng: -99.133209,
    metodoPago: 'efectivo',
    notasAdicionales: ''
  });

  useEffect(() => {
    if (!user) {
      toast.error('Debes iniciar sesión para continuar');
      navigate('/login');
    }
    if (cartItems.length === 0) {
      toast.info('Tu carrito está vacío');
      navigate('/catalogo');
    }
  }, [user, cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        productos: cartItems.map(item => ({
          producto: item._id,
          nombre: item.nombre,
          imagen: item.imagen,
          cantidad: item.quantity,
          precio: item.precio
        })),
        direccionEntrega: {
          calle: formData.calle,
          numero: formData.numero,
          colonia: formData.colonia,
          ciudad: formData.ciudad,
          codigoPostal: formData.codigoPostal,
          referencias: formData.referencias,
          coordenadas: {
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng)
          }
        },
        subtotal: getSubtotal(),
        impuestos: getTax(),
        costoEnvio: 0, // Will be set by delivery person
        total: getSubtotal() + getTax(), // Shipping added later
        metodoPago: formData.metodoPago,
        notasAdicionales: formData.notasAdicionales
      };

      const response = await createOrder(orderData);
      setOrderNumber(response.data.numeroPedido);
      setCompletedOrder(response.data);
      setOrderPlaced(true);
      clearCart();
      toast.success('¡Pedido realizado exitosamente!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'Error al realizar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-24 px-6 pb-12">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 p-8 text-center mb-8">
            <CheckCircle size={80} className="mx-auto mb-6 text-green-500" />
            <h1 className="text-4xl font-bangers text-yellow-500 mb-4">¡PEDIDO CONFIRMADO!</h1>
            <p className="text-gray-400 text-lg mb-2">Tu pedido ha sido recibido exitosamente</p>
            <div className="bg-zinc-800 rounded-lg p-6 my-8">
              <p className="text-gray-400 text-sm mb-2">Número de Pedido:</p>
              <p className="text-yellow-500 font-black text-3xl">{orderNumber}</p>
            </div>
            <p className="text-gray-300 mb-8">
              En breve un repartidor tomará tu pedido. Te notificaremos cuando esté en camino.
            </p>
          </div>

          {/* Order Receipt */}
          {completedOrder && (
            <div className="mb-8">
              <OrderReceipt ref={receiptRef} order={completedOrder} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link to="/pedidos">
              <button className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition">
                Ver Mis Pedidos
              </button>
            </Link>
            <Link to="/catalogo">
              <button className="px-8 py-3 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition">
                Seguir Comprando
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bangers text-yellow-500 mb-2">CHECKOUT</h1>
            <p className="text-gray-400">Completa tu pedido</p>
          </div>
          <Link to="/carrito">
            <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition flex items-center gap-2">
              <ArrowLeft size={20} />
              Volver al Carrito
            </button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-yellow-500" size={24} />
                  <h2 className="text-2xl font-bangers text-yellow-500">DIRECCIÓN DE ENTREGA</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Calle *</label>
                    <input
                      type="text"
                      name="calle"
                      value={formData.calle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-yellow-500 focus:outline-none"
                      placeholder="Ej: Av. Juárez"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Número *</label>
                    <input
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-yellow-500 focus:outline-none"
                      placeholder="Ej: 123"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Colonia</label>
                    <input
                      type="text"
                      name="colonia"
                      value={formData.colonia}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-yellow-500 focus:outline-none"
                      placeholder="Ej: Centro"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Ciudad *</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-yellow-500 focus:outline-none"
                      placeholder="Ej: Ciudad de México"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Código Postal</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-yellow-500 focus:outline-none"
                      placeholder="Ej: 06000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Referencias</label>
                    <textarea
                      name="referencias"
                      value={formData.referencias}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-yellow-500 focus:outline-none resize-none"
                      placeholder="Ej: Casa azul, esquina con tienda, tocar timbre"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="text-yellow-500" size={24} />
                  <h2 className="text-2xl font-bangers text-yellow-500">MÉTODO DE PAGO</h2>
                </div>

                <div className="space-y-3">
                  {/* Cash */}
                  <label className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition border-2 border-transparent has-[:checked]:border-yellow-500">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="efectivo"
                      checked={formData.metodoPago === 'efectivo'}
                      onChange={handleInputChange}
                      className="w-5 h-5 accent-yellow-500"
                    />
                    <DollarSign size={24} className="text-green-500" />
                    <div className="flex-1">
                      <p className="text-white font-bold">Efectivo</p>
                      <p className="text-gray-400 text-sm">Paga al recibir tu pedido</p>
                    </div>
                  </label>

                  {/* QR Transfer */}
                  <label className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition border-2 border-transparent has-[:checked]:border-yellow-500">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="transferencia"
                      checked={formData.metodoPago === 'transferencia'}
                      onChange={handleInputChange}
                      className="w-5 h-5 accent-yellow-500"
                    />
                    <QrCode size={24} className="text-blue-500" />
                    <div className="flex-1">
                      <p className="text-white font-bold">Transferencia/QR</p>
                      <p className="text-gray-400 text-sm">Pago por código QR (Próximamente)</p>
                    </div>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                      Próximamente
                    </span>
                  </label>

                  {/* Card */}
                  <label className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-700 transition border-2 border-transparent has-[:checked]:border-yellow-500 opacity-50">
                    <input
                      type="radio"
                      name="metodoPago"
                      value="tarjeta"
                      disabled
                      className="w-5 h-5 accent-yellow-500"
                    />
                    <CreditCard size={24} className="text-purple-500" />
                    <div className="flex-1">
                      <p className="text-white font-bold">Tarjeta</p>
                      <p className="text-gray-400 text-sm">Pago con tarjeta de crédito/débito</p>
                    </div>
                    <span className="text-xs bg-gray-600 text-gray-300 px-3 py-1 rounded-full">
                      Próximamente
                    </span>
                  </label>
                </div>

                {formData.metodoPago === 'efectivo' && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-500 text-sm">
                      💡 <strong>Tip:</strong> Ten el efectivo listo. El repartidor podría no tener cambio para billetes grandes.
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Notas Adicionales (Opcional)</h3>
                <textarea
                  name="notasAdicionales"
                  value={formData.notasAdicionales}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-yellow-500 focus:outline-none resize-none"
                  placeholder="Ej: Sin hielo, agregar limones extra, etc."
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 p-6 sticky top-24">
                <h2 className="text-2xl font-bangers text-yellow-500 mb-6">RESUMEN</h2>

                {/* Products */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex gap-3 pb-3 border-b border-zinc-800">
                      <img
                        src={item.imagen || 'https://via.placeholder.com/50'}
                        alt={item.nombre}
                        className="w-12 h-12 rounded object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{item.nombre}</p>
                        <p className="text-gray-400 text-xs">
                          {item.quantity} x ${item.precio.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-yellow-500 font-bold">
                        ${(item.precio * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span>IVA (10%):</span>
                    <span className="font-semibold">${getTax().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-300">
                    <span>Envío:</span>
                    <span className="font-semibold text-blue-400">
                      Por confirmar
                    </span>
                  </div>

                  <div className="pt-3 border-t border-zinc-800">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">Total:</span>
                      <span className="text-yellow-500 font-black text-2xl">
                        ${(getSubtotal() + getTax()).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">+ Costo de envío</p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 bg-yellow-500 text-black font-black rounded-lg hover:bg-yellow-400 transition uppercase text-lg ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Procesando...' : 'Confirmar Pedido'}
                </button>

                {/* Info Box */}
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <p className="text-gray-400 text-xs mb-3">📦 Información del envío:</p>
                  <div className="space-y-2 text-gray-400 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>El costo de envío lo establece el repartidor según la distancia</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Tiempo estimado: 30-45 minutos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Recibirás notificaciones en tiempo real</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
