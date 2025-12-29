import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User, Phone, Mail, Bike, Star, Package, Edit2, Save, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const DeliveryProfile = () => {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    avatar: '',
    vehiculo: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        telefono: user.telefono || '',
        avatar: user.avatar || '',
        vehiculo: user.vehiculo || 'motocicleta'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put('/api/auth/updateprofile', formData);
      toast.success('¡Perfil actualizado, Don!');
      setEditing(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || '¡Uy! No se pudo actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bangers text-yellow-500 mb-2">MI PERFIL</h1>
        <p className="text-gray-400">Repartidor - DON CHUPILAS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-zinc-900 rounded-2xl border border-yellow-500/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 p-8 border-b border-yellow-500/20">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-yellow-500 flex items-center justify-center text-5xl overflow-hidden">
                  {user.avatar && user.avatar !== 'https://via.placeholder.com/150' ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>🏍️</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  Repartidor
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{user.nombre}</h2>
                <p className="text-gray-400">{user.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="#facc15" />
                    <span className="font-bold">{user.calificacionPromedio?.toFixed(1) || '5.0'}</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {user.pedidosEntregados || 0} entregas
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {!editing ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg">
                  <User className="text-yellow-500" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">Nombre Completo</p>
                    <p className="text-white font-semibold">{user.nombre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg">
                  <Mail className="text-yellow-500" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-semibold">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg">
                  <Phone className="text-yellow-500" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">Teléfono de Contacto</p>
                    <p className="text-white font-semibold">{user.telefono}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg">
                  <Bike className="text-yellow-500" size={24} />
                  <div>
                    <p className="text-gray-400 text-sm">Tipo de Vehículo</p>
                    <p className="text-white font-semibold capitalize">{user.vehiculo || 'Motocicleta'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                >
                  <Edit2 size={20} />
                  Editar Perfil
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    <User size={16} className="inline mr-2" />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    <Bike size={16} className="inline mr-2" />
                    Tipo de Vehículo
                  </label>
                  <select
                    name="vehiculo"
                    value={formData.vehiculo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition"
                  >
                    <option value="motocicleta">Motocicleta</option>
                    <option value="bicicleta">Bicicleta</option>
                    <option value="auto">Automóvil</option>
                    <option value="scooter">Scooter Eléctrico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    URL de Avatar (opcional)
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/avatar.jpg"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save size={20} />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        nombre: user.nombre || '',
                        telefono: user.telefono || '',
                        avatar: user.avatar || '',
                        vehiculo: user.vehiculo || 'motocicleta'
                      });
                    }}
                    className="flex-1 py-3 bg-zinc-700 text-white font-bold rounded-lg hover:bg-zinc-600 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Rating Card */}
          <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Star className="text-yellow-500" size={24} fill="#facc15" />
              <h3 className="text-xl font-bangers text-yellow-500">CALIFICACIÓN</h3>
            </div>
            <div className="text-center">
              <p className="text-5xl font-black text-yellow-500 mb-2">
                {user.calificacionPromedio?.toFixed(1) || '5.0'}
              </p>
              <p className="text-gray-400 text-sm">Promedio de calificaciones</p>
            </div>
          </div>

          {/* Deliveries Card */}
          <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="text-yellow-500" size={24} />
              <h3 className="text-xl font-bangers text-yellow-500">ENTREGAS</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Entregas</p>
                <p className="text-3xl font-black text-white">{user.pedidosEntregados || 0}</p>
              </div>
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <TrendingUp size={16} />
                <span>¡Sigue así, Don!</span>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl border border-yellow-500/20 p-6">
            <h3 className="text-lg font-bangers text-yellow-500 mb-3">ESTADO</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-white font-bold">Activo</span>
            </div>
            <p className="text-gray-300 text-sm">
              Listo para tomar pedidos
            </p>
          </div>

          {/* Tips Card */}
          <div className="bg-zinc-900 rounded-xl border border-yellow-500/20 p-6">
            <h3 className="text-lg font-bangers text-yellow-500 mb-3">💡 CONSEJOS</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Mantén tu perfil actualizado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Sé puntual en las entregas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Comunícate con el cliente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Lleva cambio siempre</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryProfile;
