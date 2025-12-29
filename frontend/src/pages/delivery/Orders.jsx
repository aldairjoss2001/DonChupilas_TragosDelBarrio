import { useState, useEffect } from 'react';
import { getAvailableOrders, takeOrder } from '../../services/orderService';
import { Package, MapPin, DollarSign, Clock, Phone, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAvailableOrders();
      setOrders(response.data || []);
    } catch (error) {
      toast.error('Error al cargar pedidos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeOrder = async (orderId) => {
    try {
      await takeOrder(orderId);
      toast.success('¡Pedido asignado! A entregar, Don.');
      fetchOrders();
      navigate(`/delivery/ruta/${orderId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al tomar pedido');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-yellow-500 text-2xl font-bangers">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bangers text-yellow-500 mb-2">PEDIDOS DISPONIBLES</h1>
        <p className="text-gray-400">Toma un pedido para empezar a entregar</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl p-12 text-center border border-yellow-500/20">
          <Package size={64} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-xl mb-2">No hay pedidos disponibles en este momento.</p>
          <p className="text-gray-500 text-sm">Espera a que lleguen nuevos pedidos, Don.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-zinc-900 rounded-xl border border-yellow-500/20 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 p-4 border-b border-yellow-500/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bangers text-yellow-500">#{order.numeroPedido}</h3>
                    <p className="text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                    <Clock size={16} className="text-yellow-500" />
                    <span className="text-yellow-500 font-bold text-sm">{order.tiempoEstimado || 30} min</span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Cliente Info */}
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={18} className="text-yellow-500" />
                    <span className="text-white font-bold">{order.cliente?.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone size={16} />
                    <span className="text-sm">{order.cliente?.telefono}</span>
                  </div>
                </div>

                {/* Dirección */}
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold mb-1">Dirección de Entrega:</p>
                      <p className="text-gray-400 text-sm">
                        {order.direccionEntrega.calle} {order.direccionEntrega.numero}
                        {order.direccionEntrega.colonia && `, ${order.direccionEntrega.colonia}`}
                      </p>
                      <p className="text-gray-400 text-sm">{order.direccionEntrega.ciudad}</p>
                      {order.direccionEntrega.referencias && (
                        <p className="text-gray-500 text-xs mt-2">
                          📍 {order.direccionEntrega.referencias}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={18} className="text-yellow-500" />
                    <span className="text-white font-bold">Productos ({order.productos.length})</span>
                  </div>
                  <div className="space-y-1">
                    {order.productos.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">
                          {item.cantidad}x {item.nombre}
                        </span>
                        <span className="text-white font-semibold">
                          ${(item.precio * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total y Método de Pago */}
                <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-bold">Total a Cobrar:</span>
                    <span className="text-yellow-500 font-black text-2xl">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-yellow-500" />
                    <span className="text-gray-400 text-sm capitalize">
                      Método de Pago: <strong className="text-white">{order.metodoPago}</strong>
                    </span>
                  </div>
                  {order.metodoPago === 'efectivo' && (
                    <p className="text-yellow-500 text-xs mt-2">⚠️ Recuerda llevar cambio</p>
                  )}
                </div>

                {/* Notas Especiales */}
                {order.notasEspeciales && (
                  <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                    <p className="text-blue-400 text-sm">
                      <strong>Nota del cliente:</strong> {order.notasEspeciales}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <button
                  onClick={() => handleTakeOrder(order._id)}
                  className="w-full py-4 bg-yellow-500 text-black font-black text-lg rounded-lg hover:bg-yellow-400 transition uppercase"
                >
                  🏍️ Tomar Pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryOrders;
