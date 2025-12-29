import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, assignDelivery } from '../../services/orderService';
import { Package, Eye, User, DollarSign, MapPin, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryUsers, setDeliveryUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchDeliveryUsers();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { estado: filterStatus } : {};
      const response = await getAllOrders(params);
      setOrders(response.data || []);
    } catch (error) {
      toast.error('Error al cargar pedidos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      const repartidores = response.data.data.filter(u => u.rol === 'repartidor');
      setDeliveryUsers(repartidores);
    } catch (error) {
      console.error('Error fetching delivery users:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Estado actualizado a ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleAssignDelivery = async () => {
    if (!selectedDelivery || !selectedOrder) return;

    try {
      await assignDelivery(selectedOrder._id, selectedDelivery);
      toast.success('¡Repartidor asignado!');
      setShowAssignModal(false);
      setSelectedOrder(null);
      setSelectedDelivery('');
      fetchOrders();
    } catch (error) {
      toast.error('Error al asignar repartidor');
    }
  };

  const getStatusColor = (estado) => {
    const colors = {
      recibido: 'bg-blue-500/20 text-blue-500',
      preparando: 'bg-yellow-500/20 text-yellow-500',
      en_camino: 'bg-purple-500/20 text-purple-500',
      entregado: 'bg-green-500/20 text-green-500',
      cancelado: 'bg-red-500/20 text-red-500'
    };
    return colors[estado] || colors.recibido;
  };

  const stats = {
    total: orders.length,
    recibido: orders.filter(o => o.estado === 'recibido').length,
    preparando: orders.filter(o => o.estado === 'preparando').length,
    en_camino: orders.filter(o => o.estado === 'en_camino').length,
    entregado: orders.filter(o => o.estado === 'entregado').length
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
        <h1 className="text-4xl font-bangers text-yellow-500 mb-2">GESTIÓN DE PEDIDOS</h1>
        <p className="text-gray-400">Administra los pedidos de los clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-xl border border-yellow-500/20 text-center">
          <p className="text-gray-400 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.total}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-blue-500/20 text-center">
          <p className="text-gray-400 text-sm mb-1">Recibidos</p>
          <p className="text-2xl font-bold text-blue-500">{stats.recibido}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-yellow-500/20 text-center">
          <p className="text-gray-400 text-sm mb-1">Preparando</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.preparando}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-purple-500/20 text-center">
          <p className="text-gray-400 text-sm mb-1">En Camino</p>
          <p className="text-2xl font-bold text-purple-500">{stats.en_camino}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-green-500/20 text-center">
          <p className="text-gray-400 text-sm mb-1">Entregados</p>
          <p className="text-2xl font-bold text-green-500">{stats.entregado}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 rounded-xl p-4 mb-6 border border-yellow-500/20">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterStatus === '' ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterStatus('recibido')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterStatus === 'recibido' ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'
            }`}
          >
            Recibidos
          </button>
          <button
            onClick={() => setFilterStatus('preparando')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterStatus === 'preparando' ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'
            }`}
          >
            Preparando
          </button>
          <button
            onClick={() => setFilterStatus('en_camino')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterStatus === 'en_camino' ? 'bg-purple-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'
            }`}
          >
            En Camino
          </button>
          <button
            onClick={() => setFilterStatus('entregado')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filterStatus === 'entregado' ? 'bg-green-500 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white'
            }`}
          >
            Entregados
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-zinc-900 rounded-xl border border-yellow-500/20 overflow-hidden">
            <div className="bg-zinc-800 p-4 border-b border-yellow-500/20">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bangers text-yellow-500">#{order.numeroPedido}</h3>
                  <p className="text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleString('es-MX')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.estado)}`}>
                  {order.estado.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Cliente */}
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-yellow-500" />
                <span className="text-white font-semibold">{order.cliente?.nombre}</span>
                <span className="text-gray-400">{order.cliente?.telefono}</span>
              </div>

              {/* Productos */}
              <div className="bg-zinc-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={16} className="text-yellow-500" />
                  <span className="text-white font-semibold text-sm">Productos ({order.productos.length})</span>
                </div>
                <div className="space-y-1">
                  {order.productos.slice(0, 2).map((item, idx) => (
                    <p key={idx} className="text-gray-400 text-xs">
                      {item.cantidad}x {item.nombre}
                    </p>
                  ))}
                  {order.productos.length > 2 && (
                    <p className="text-gray-500 text-xs">+{order.productos.length - 2} más...</p>
                  )}
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="text-yellow-500 mt-1" />
                <span className="text-gray-400 text-xs">
                  {order.direccionEntrega.calle} {order.direccionEntrega.numero}, {order.direccionEntrega.ciudad}
                </span>
              </div>

              {/* Total y Método de Pago */}
              <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-yellow-500" />
                  <span className="text-white font-bold">${order.total.toFixed(2)}</span>
                  <span className="text-gray-400 text-xs capitalize">({order.metodoPago})</span>
                </div>
                <div className="flex items-center gap-1">
                  {order.metodoPago === 'efectivo' && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">
                      💵 Efectivo
                    </span>
                  )}
                  {order.metodoPago === 'tarjeta' && (
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                      💳 Pagado
                    </span>
                  )}
                  {order.metodoPago === 'transferencia' && (
                    <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">
                      🏦 Transferencia
                    </span>
                  )}
                </div>
              </div>

              {/* Repartidor */}
              {order.repartidor ? (
                <div className="bg-zinc-800 p-2 rounded-lg flex items-center gap-2">
                  <span className="text-xs text-gray-400">Repartidor:</span>
                  <span className="text-white text-sm font-semibold">{order.repartidor.nombre}</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowAssignModal(true);
                  }}
                  className="w-full py-2 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition text-sm font-bold"
                >
                  Asignar Repartidor
                </button>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {order.estado === 'recibido' && (
                  <button
                    onClick={() => handleStatusChange(order._id, 'preparando')}
                    className="flex-1 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition text-sm font-bold"
                  >
                    Preparando
                  </button>
                )}
                {order.estado === 'preparando' && order.repartidor && (
                  <button
                    onClick={() => handleStatusChange(order._id, 'en_camino')}
                    className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition text-sm font-bold"
                  >
                    En Camino
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No hay pedidos con ese filtro.
        </div>
      )}

      {/* Assign Delivery Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl max-w-md w-full p-6 border border-yellow-500/20">
            <h2 className="text-2xl font-bangers text-yellow-500 mb-4">ASIGNAR REPARTIDOR</h2>
            <p className="text-gray-400 mb-4">Pedido #{selectedOrder?.numeroPedido}</p>
            
            <select
              value={selectedDelivery}
              onChange={(e) => setSelectedDelivery(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 mb-4"
            >
              <option value="">Seleccionar repartidor...</option>
              {deliveryUsers.map(user => (
                <option key={user._id} value={user._id}>
                  {user.nombre} - {user.vehiculo || 'Sin vehículo'} (⭐ {user.calificacionPromedio?.toFixed(1) || '5.0'})
                </option>
              ))}
            </select>

            <div className="flex gap-4">
              <button
                onClick={handleAssignDelivery}
                disabled={!selectedDelivery}
                className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Asignar
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedOrder(null);
                  setSelectedDelivery('');
                }}
                className="flex-1 py-3 bg-zinc-700 text-white font-bold rounded-lg hover:bg-zinc-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
