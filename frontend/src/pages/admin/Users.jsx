import { useState, useEffect } from 'react';
import { Users as UsersIcon, UserCheck, UserX, Edit2, Crown, Bike, User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/users/${userId}/role`, { rol: newRole });
      toast.success('¡Rol actualizado, Don!');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al cambiar rol');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`/api/users/${userId}/status`, { activo: !currentStatus });
      toast.success(`Usuario ${!currentStatus ? 'activado' : 'desactivado'}`);
      fetchUsers();
    } catch (error) {
      toast.error('Error al cambiar estado');
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Crown size={16} className="text-yellow-500" />;
      case 'repartidor': return <Bike size={16} className="text-blue-500" />;
      default: return <UserIcon size={16} className="text-gray-400" />;
    }
  };

  const getRoleEmoji = (role) => {
    switch(role) {
      case 'admin': return '👑';
      case 'repartidor': return '🏍️';
      default: return '🍺';
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'todos') return true;
    return user.rol === filter;
  });

  const stats = {
    total: users.length,
    clientes: users.filter(u => u.rol === 'cliente').length,
    admins: users.filter(u => u.rol === 'admin').length,
    repartidores: users.filter(u => u.rol === 'repartidor').length,
    activos: users.filter(u => u.activo).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-yellow-500 text-2xl font-bangers">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bangers text-yellow-500 mb-2">GESTIÓN DE USUARIOS</h1>
        <p className="text-gray-400">Administra los usuarios del sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-xl border border-yellow-500/20 text-center">
          <p className="text-gray-400 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.total}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-yellow-500/20 text-center">
          <p className="text-gray-400 text-sm mb-1">Clientes</p>
          <p className="text-2xl font-bold text-white">{stats.clientes}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-yellow-500/20 text-center">
          <p className="text-gray-400 text-sm mb-1">Admins</p>
          <p className="text-2xl font-bold text-white">{stats.admins}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-yellow-500/20 text-center">
          <p className="text-gray-400 text-sm mb-1">Repartidores</p>
          <p className="text-2xl font-bold text-white">{stats.repartidores}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-yellow-500/20 text-center">
          <p className="text-gray-400 text-sm mb-1">Activos</p>
          <p className="text-2xl font-bold text-green-500">{stats.activos}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900 rounded-xl p-4 mb-6 border border-yellow-500/20">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'todos' ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('cliente')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'cliente' ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'admin' ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setFilter('repartidor')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'repartidor' ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'
            }`}
          >
            Repartidores
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-800 border-b border-yellow-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Usuario</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Contacto</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Rol</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-yellow-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-2xl">
                        {getRoleEmoji(user.rol)}
                      </div>
                      <div>
                        <p className="font-semibold text-white flex items-center gap-2">
                          {user.nombre}
                          {getRoleIcon(user.rol)}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{user.telefono}</p>
                    {user.rol === 'repartidor' && user.vehiculo && (
                      <p className="text-xs text-gray-400 capitalize">Vehículo: {user.vehiculo}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.rol}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-zinc-800 text-white px-3 py-2 rounded-lg text-sm font-semibold border border-zinc-700 focus:outline-none focus:border-yellow-500 capitalize"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Admin</option>
                      <option value="repartidor">Repartidor</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.activo ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(user._id, user.activo)}
                      className={`p-2 rounded-lg transition ${
                        user.activo 
                          ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                          : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                      }`}
                      title={user.activo ? 'Desactivar' : 'Activar'}
                    >
                      {user.activo ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No hay usuarios con ese filtro.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
