import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { User, Phone, Mail, MapPin, Edit2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import MapSelector from '../../components/common/MapSelector';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    avatar: '',
    ubicacionPredeterminada: {
      lat: 19.4326,
      lng: -99.1332
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        telefono: user.telefono || '',
        avatar: user.avatar || '',
        ubicacionPredeterminada: user.ubicacionPredeterminada || {
          lat: 19.4326,
          lng: -99.1332
        }
      });
    }
  }, [user]);

  const handleLocationChange = (position) => {
    setFormData({
      ...formData,
      ubicacionPredeterminada: {
        lat: position[0],
        lng: position[1]
      }
    });
  };

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
      // Reload user data
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || '¡Uy! No se pudo actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  // Get role icon based on user role
  const getRoleIcon = () => {
    switch(user?.rol) {
      case 'admin':
        return '👑'; // Crown for admin
      case 'repartidor':
        return '🏍️'; // Motorcycle for delivery
      default:
        return '🍺'; // Beer for client
    }
  };

  const getRoleLabel = () => {
    switch(user?.rol) {
      case 'admin':
        return 'Administrador';
      case 'repartidor':
        return 'Repartidor';
      default:
        return 'Cliente';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bangers text-yellow-500 mb-8">MI PERFIL</h1>

        <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 p-8 border-b border-yellow-500/20">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-yellow-500 flex items-center justify-center text-5xl overflow-hidden">
                  {user.avatar && user.avatar !== 'https://via.placeholder.com/150' ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{getRoleIcon()}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                  {getRoleLabel()}
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{user.nombre}</h2>
                <p className="text-gray-400">{user.email}</p>
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
                    <p className="text-gray-400 text-sm">Nombre</p>
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
                    <p className="text-gray-400 text-sm">Teléfono</p>
                    <p className="text-white font-semibold">{user.telefono}</p>
                  </div>
                </div>

                {user.rol === 'repartidor' && (
                  <>
                    <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg">
                      <MapPin className="text-yellow-500" size={24} />
                      <div>
                        <p className="text-gray-400 text-sm">Vehículo</p>
                        <p className="text-white font-semibold capitalize">{user.vehiculo || 'No especificado'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-800 rounded-lg text-center">
                        <p className="text-gray-400 text-sm mb-1">Pedidos Entregados</p>
                        <p className="text-yellow-500 font-bold text-3xl">{user.pedidosEntregados || 0}</p>
                      </div>
                      <div className="p-4 bg-zinc-800 rounded-lg text-center">
                        <p className="text-gray-400 text-sm mb-1">Calificación</p>
                        <p className="text-yellow-500 font-bold text-3xl">
                          ⭐ {user.calificacionPromedio?.toFixed(1) || '5.0'}
                        </p>
                      </div>
                    </div>
                  </>
                )}

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
                    Nombre
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

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Ubicación Predeterminada (para entregas)
                  </label>
                  <MapSelector
                    initialPosition={[
                      formData.ubicacionPredeterminada?.lat || 19.4326,
                      formData.ubicacionPredeterminada?.lng || -99.1332
                    ]}
                    onLocationChange={handleLocationChange}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    📍 Haz click en el mapa para marcar tu ubicación exacta
                  </p>
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
                      setShowMap(false);
                      setFormData({
                        nombre: user.nombre || '',
                        telefono: user.telefono || '',
                        avatar: user.avatar || '',
                        ubicacionPredeterminada: user.ubicacionPredeterminada || {
                          lat: 19.4326,
                          lng: -99.1332
                        }
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
      </div>
    </div>
  );
};

export default Profile;