import { useState, useEffect } from 'react';
import { getMyOrders } from '../../services/orderService';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Eye, FileText, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import OrderReceipt from '../../components/common/OrderReceipt';
import RatingModal from '../../components/common/RatingModal';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratingOrder, setRatingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getMyOrders();
      setOrders(response.data || []);
    } catch (error) {
      toast.error('¡Uy! No pudimos cargar tus pedidos, Don.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (estado) => {
    const statusMap = {
      recibido: { label: 'Recibido', color: 'bg-blue-500/20 text-blue-500', icon: Package },
      preparando: { label: 'Preparando', color: 'bg-yellow-500/20 text-yellow-500', icon: Clock },
      en_camino: { label: 'En Camino', color: 'bg-purple-500/20 text-purple-500', icon: Package },
      entregado: { label: 'Entregado', color: 'bg-green-500/20 text-green-500', icon: CheckCircle },
      cancelado: { label: 'Cancelado', color: 'bg-red-500/20 text-red-500', icon: XCircle }
    };
    return statusMap[estado] || statusMap.recibido;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-500 font-bangers text-2xl">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bangers text-yellow-500 mb-8">MIS PEDIDOS</h1>

        {/* Receipt Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
            <div className="bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-yellow-500/20 flex justify-between items-center sticky top-0 bg-zinc-900">
                <h2 className="text-2xl font-bangers text-yellow-500">Recibo del Pedido</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-6">
                <OrderReceipt order={selectedOrder} />
              </div>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        {ratingOrder && (
          <RatingModal
            order={ratingOrder}
            onClose={() => setRatingOrder(null)}
            onRated={() => {
              fetchOrders();
              setRatingOrder(null);
            }}
          />
        )}

        {orders.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-12 text-center border border-yellow-500/20">
            <Package size={64} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-xl mb-6">Aún no has hecho ningún pedido, Don.</p>
            <Link to="/catalogo">
              <button className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition">
                Ver Catálogo
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.estado);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={order._id} className="bg-zinc-900 rounded-2xl border border-yellow-500/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 p-6 border-b border-yellow-500/20">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bangers text-yellow-500 mb-1">
                          Pedido #{order.numeroPedido}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${statusInfo.color}`}>
                          <StatusIcon size={16} />
                          {statusInfo.label}
                        </span>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition"
                          title="Ver Recibo"
                        >
                          <FileText size={20} />
                        </button>
                        <Link to={`/tracking/${order._id}`}>
                          <button className="p-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition" title="Seguir Pedido">
                            <Eye size={20} />
                          </button>
                        </Link>
                        {order.estado === 'entregado' && !order.calificacion && (
                          <button
                            onClick={() => setRatingOrder(order)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
                            title="Calificar Entrega"
                          >
                            <Star size={20} />
                          </button>
                        )}
                        {order.calificacion && (
                          <div className="flex items-center gap-1 bg-green-500/20 px-3 py-2 rounded-lg">
                            <Star size={16} className="fill-yellow-500 text-yellow-500" />
                            <span className="text-yellow-500 font-bold">{order.calificacion.puntuacion}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Products */}
                    <div className="mb-6">
                      <h4 className="text-white font-bold mb-3">Productos:</h4>
                      <div className="space-y-2">
                        {order.productos.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.imagen || 'https://via.placeholder.com/50'}
                                alt={item.nombre}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                              />
                              <div>
                                <p className="text-white font-semibold">{item.nombre}</p>
                                <p className="text-gray-400 text-sm">Cantidad: {item.cantidad}</p>
                              </div>
                            </div>
                            <p className="text-yellow-500 font-bold">${(item.precio * item.cantidad).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <h4 className="text-white font-bold mb-2">Dirección de Entrega:</h4>
                        <p className="text-gray-400 text-sm">
                          {order.direccionEntrega.calle} {order.direccionEntrega.numero}
                          {order.direccionEntrega.colonia && `, ${order.direccionEntrega.colonia}`}
                          <br />
                          {order.direccionEntrega.ciudad}
                          {order.direccionEntrega.referencias && (
                            <>
                              <br />
                              <span className="text-xs">Ref: {order.direccionEntrega.referencias}</span>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <h4 className="text-white font-bold mb-2">Método de Pago:</h4>
                        <p className="text-gray-400 capitalize">{order.metodoPago}</p>
                        {order.repartidor && (
                          <>
                            <h4 className="text-white font-bold mt-3 mb-2">Repartidor:</h4>
                            <p className="text-gray-400">{order.repartidor.nombre}</p>
                            <p className="text-gray-400 text-sm">{order.repartidor.telefono}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold text-xl">Total:</span>
                        <span className="text-yellow-500 font-black text-3xl">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
