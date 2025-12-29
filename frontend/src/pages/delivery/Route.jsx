import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Package, MapPin, Phone, Navigation, MessageCircle, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const storeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const clientIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DeliveryRoute = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  // Store location (Don Chupilas)
  const storeLocation = [19.4326, -99.1332];

  useEffect(() => {
    fetchOrderDetails();
    
    // Setup socket.io
    socketRef.current = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });

    socketRef.current.emit('join-order-room', id);

    socketRef.current.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('status-update', (data) => {
      if (data.orderId === id) {
        setOrder(prev => ({ ...prev, estado: data.estado }));
        toast.info(`Estado actualizado: ${data.estado}`);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      // Stop GPS tracking when component unmounts
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (showChat && order) {
      fetchMessages();
    }
  }, [showChat, order]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchOrderDetails = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`);
      setOrder(data);
    } catch (error) {
      toast.error('Error cargando detalles del pedido');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`/api/messages/${id}`);
      setMessages(data);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const { data } = await axios.post(`/api/messages/${id}`, {
        mensaje: newMessage
      });
      
      socketRef.current.emit('send-message', {
        orderId: id,
        message: data
      });
      
      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Error enviando mensaje');
      console.error(error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { estado: newStatus });
      setOrder(prev => ({ ...prev, estado: newStatus }));
      
      socketRef.current.emit('status-update', {
        orderId: id,
        estado: newStatus
      });
      
      toast.success(`Estado cambiado a: ${newStatus}`);
      
      if (newStatus === 'entregado') {
        stopTracking(); // Stop GPS tracking when delivered
        setTimeout(() => navigate('/delivery/pedidos'), 2000);
      }
    } catch (error) {
      toast.error('Error actualizando estado');
      console.error(error);
    }
  };

  // Start GPS tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error('Tu dispositivo no soporta geolocalización');
      return;
    }

    setTracking(true);
    toast.success('📍 Tracking GPS activado');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        
        setDriverLocation(newLocation);
        
        // Emit location to socket
        if (socketRef.current) {
          socketRef.current.emit('location-update', {
            orderId: id,
            lat: latitude,
            lng: longitude
          });
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Error obteniendo ubicación GPS');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Stop GPS tracking
  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setTracking(false);
      toast.info('📍 Tracking GPS desactivado');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      recibido: 'bg-blue-500',
      preparando: 'bg-yellow-500',
      en_camino: 'bg-purple-500',
      entregado: 'bg-green-500',
      cancelado: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getNextStatus = () => {
    const statusFlow = {
      recibido: 'preparando',
      preparando: 'en_camino',
      en_camino: 'entregado'
    };
    return statusFlow[order?.estado];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando ruta...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Pedido no encontrado</p>
      </div>
    );
  }

  const clientLocation = [
    order.direccionEntrega.coordenadas.lat,
    order.direccionEntrega.coordenadas.lng
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-yellow-500/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/delivery/pedidos')}
            className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition"
          >
            <ArrowLeft size={20} />
            <span>Volver a Pedidos</span>
          </button>
          <h1 className="text-2xl font-bangers text-yellow-500">
            RUTA DE ENTREGA - {order.numeroPedido}
          </h1>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.estado)}`}>
            {order.estado.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 overflow-hidden h-[600px]">
              <MapContainer
                center={[(storeLocation[0] + clientLocation[0]) / 2, (storeLocation[1] + clientLocation[1]) / 2]}
                zoom={12}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Store Marker */}
                <Marker position={storeLocation} icon={storeIcon}>
                  <Popup>
                    <div className="text-center">
                      <strong>🏪 Don Chupilas</strong>
                      <p className="text-sm">Origen</p>
                    </div>
                  </Popup>
                </Marker>
                
                {/* Client Marker */}
                <Marker position={clientLocation} icon={clientIcon}>
                  <Popup>
                    <div className="text-center">
                      <strong>📍 Cliente</strong>
                      <p className="text-sm">{order.cliente.nombre}</p>
                      <p className="text-xs">{order.direccionEntrega.calle} {order.direccionEntrega.numero}</p>
                    </div>
                  </Popup>
                </Marker>
                
                {/* Driver Location Marker (when tracking) */}
                {tracking && driverLocation && (
                  <Marker position={[driverLocation.lat, driverLocation.lng]}>
                    <Popup>
                      <div className="text-center">
                        <strong>🏍️ Tu Ubicación</strong>
                        <p className="text-sm">Tracking activo</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
                
                {/* Route Line */}
                <Polyline
                  positions={[storeLocation, clientLocation]}
                  color="#facc15"
                  weight={3}
                  opacity={0.7}
                  dashArray="10, 10"
                />
              </MapContainer>
            </div>
          </div>

          {/* Order Details & Actions */}
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 p-6">
              <h3 className="text-xl font-bangers text-yellow-500 mb-4">INFORMACIÓN DEL CLIENTE</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="text-yellow-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-400">Cliente</p>
                    <p className="font-semibold">{order.cliente.nombre}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="text-yellow-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-400">Teléfono</p>
                    <p className="font-semibold">{order.cliente.telefono}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-400">Dirección</p>
                    <p className="font-semibold">
                      {order.direccionEntrega.calle} {order.direccionEntrega.numero}
                    </p>
                    {order.direccionEntrega.colonia && (
                      <p className="text-sm text-gray-400">{order.direccionEntrega.colonia}</p>
                    )}
                    <p className="text-sm text-gray-400">{order.direccionEntrega.ciudad}</p>
                    {order.direccionEntrega.referencias && (
                      <p className="text-xs text-yellow-400 mt-1">
                        📌 {order.direccionEntrega.referencias}
                      </p>
                    )}
                  </div>
                </div>

                {order.notasEspeciales && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Notas Especiales:</p>
                    <p className="text-sm text-yellow-300">{order.notasEspeciales}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Actions */}
            <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 p-6">
              <h3 className="text-xl font-bangers text-yellow-500 mb-4">ACTUALIZAR ESTADO</h3>
              
              {getNextStatus() && (
                <button
                  onClick={() => handleStatusChange(getNextStatus())}
                  className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition flex items-center justify-center gap-2 mb-3"
                >
                  <CheckCircle2 size={20} />
                  Marcar como: {getNextStatus().replace('_', ' ').toUpperCase()}
                </button>
              )}

              {order.estado === 'entregado' && (
                <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
                  <p className="text-green-400 font-bold">✅ Pedido Entregado</p>
                </div>
              )}

              {/* GPS Tracking Button */}
              <div className="mt-6">
                <button
                  onClick={tracking ? stopTracking : startTracking}
                  className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                    tracking
                      ? 'bg-red-500 hover:bg-red-400 text-white'
                      : 'bg-green-500 hover:bg-green-400 text-white'
                  }`}
                >
                  <Navigation size={20} className={tracking ? 'animate-pulse' : ''} />
                  {tracking ? '📍 Detener Tracking GPS' : '📍 Activar Tracking GPS'}
                </button>
                {tracking && driverLocation && (
                  <div className="mt-2 text-xs text-gray-400 text-center">
                    <p>Ubicación compartida en tiempo real</p>
                    <p className="text-green-400">
                      {driverLocation.lat.toFixed(6)}, {driverLocation.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-zinc-800 rounded">
                  <span className="text-gray-400">Total a cobrar:</span>
                  <span className="font-bold text-yellow-500">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-zinc-800 rounded">
                  <span className="text-gray-400">Método de pago:</span>
                  <span className="font-bold capitalize">{order.metodoPago}</span>
                </div>
                {order.metodoPago === 'efectivo' && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2 text-center">
                    <p className="text-yellow-400 text-xs">💵 No olvides llevar cambio</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat */}
            <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 p-6">
              <button
                onClick={() => setShowChat(!showChat)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="text-xl font-bangers text-yellow-500">CHAT CON CLIENTE</h3>
                <MessageCircle className="text-yellow-500" size={24} />
              </button>
              
              {showChat && (
                <div>
                  <div className="bg-zinc-800 rounded-lg h-64 overflow-y-auto p-3 mb-3">
                    {messages.length === 0 ? (
                      <p className="text-gray-500 text-center text-sm">No hay mensajes aún</p>
                    ) : (
                      messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`mb-3 ${msg.tipoRemitente === 'repartidor' ? 'text-right' : 'text-left'}`}
                        >
                          <div
                            className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                              msg.tipoRemitente === 'repartidor'
                                ? 'bg-yellow-500 text-black'
                                : 'bg-zinc-700 text-white'
                            }`}
                          >
                            <p className="text-sm">{msg.mensaje}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString('es-MX', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      disabled={sendingMessage}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sendingMessage}
                      className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRoute;
