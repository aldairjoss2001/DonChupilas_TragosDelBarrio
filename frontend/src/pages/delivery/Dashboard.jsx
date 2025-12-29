import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Package, CheckCircle, Clock, TrendingUp, Star, Trophy } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const DeliveryDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    availableOrders: 0,
    todayDeliveries: 0,
    totalDeliveries: 0,
    rating: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get available orders
      const availableRes = await axios.get('/api/orders/available');
      
      // Get my orders (delivered today)
      const myOrdersRes = await axios.get('/api/orders/myorders');
      const today = new Date().toDateString();
      const todayOrders = myOrdersRes.data.data.filter(order => {
        const orderDate = new Date(order.createdAt).toDateString();
        return orderDate === today && order.estado === 'entregado';
      });

      setStats({
        availableOrders: availableRes.data.count || 0,
        todayDeliveries: todayOrders.length,
        totalDeliveries: user?.pedidosEntregados || 0,
        rating: user?.calificacionPromedio || 5
      });

      // Get recent orders (last 3)
      setRecentOrders(myOrdersRes.data.data.slice(0, 3));
    } catch (error) {
      toast.error('Error al cargar datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleEmoji = () => '🏍️';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-yellow-500 text-2xl font-bangers">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="text-5xl">{getRoleEmoji()}</div>
          <div>
            <h1 className="text-4xl font-bangers text-yellow-500">¡BIENVENIDO, {user?.nombre?.toUpperCase()}!</h1>
            <p className="text-gray-400">Tu panel de repartidor</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 p-6 rounded-xl border-2 border-yellow-500/50">
          <div className="flex items-center justify-between mb-4">
            <Package className="text-yellow-500" size={32} />
            <span className="text-yellow-500 font-black text-3xl">{stats.availableOrders}</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Pedidos Disponibles</h3>
          <p className="text-gray-400 text-sm">Listos para tomar</p>
          {stats.availableOrders > 0 && (
            <Link to="/delivery/pedidos">
              <button className="mt-4 w-full py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition text-sm">
                Ver Pedidos
              </button>
            </Link>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-xl border border-green-500/50">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="text-green-500" size={32} />
            <span className="text-green-500 font-black text-3xl">{stats.todayDeliveries}</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Entregas de Hoy</h3>
          <p className="text-gray-400 text-sm">Pedidos completados hoy</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-xl border border-blue-500/50">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="text-blue-500" size={32} />
            <span className="text-blue-500 font-black text-3xl">{stats.totalDeliveries}</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Total Entregas</h3>
          <p className="text-gray-400 text-sm">Pedidos totales entregados</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-xl border border-purple-500/50">
          <div className="flex items-center justify-between mb-4">
            <Star className="text-purple-500" size={32} />
            <span className="text-purple-500 font-black text-3xl">{stats.rating.toFixed(1)}</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">Calificación</h3>
          <p className="text-gray-400 text-sm">
            {'⭐'.repeat(Math.round(stats.rating))}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 p-6 mb-8">
        <h2 className="text-2xl font-bangers text-yellow-500 mb-4">ACCIONES RÁPIDAS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/delivery/pedidos">
            <button className="w-full py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition flex items-center justify-center gap-2">
              <Package size={20} />
              Ver Pedidos Disponibles
            </button>
          </Link>
          <Link to="/perfil">
            <button className="w-full py-4 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition flex items-center justify-center gap-2">
              👤 Mi Perfil
            </button>
          </Link>
          <button
            onClick={() => toast.info('Función próximamente disponible')}
            className="w-full py-4 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition flex items-center justify-center gap-2"
          >
            📊 Mis Estadísticas
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 p-6">
          <h2 className="text-2xl font-bangers text-yellow-500 mb-4">ENTREGAS RECIENTES</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="bg-zinc-800 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">#{order.numeroPedido}</p>
                  <p className="text-gray-400 text-sm">{order.cliente?.nombre}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString('es-MX')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-500 font-bold">${order.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.estado === 'entregado' 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {order.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-xl p-6 border border-yellow-500/20">
        <h3 className="text-xl font-bangers text-yellow-500 mb-3">💡 CONSEJOS DEL DÍA</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">✓</span>
            <span>Verifica siempre el método de pago antes de salir</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">✓</span>
            <span>Lleva cambio si el pago es en efectivo</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">✓</span>
            <span>Llama al cliente si tienes dudas sobre la dirección</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">✓</span>
            <span>Mantén los productos en posición vertical durante el traslado</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
