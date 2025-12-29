import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Package, MapPin, Phone, MessageCircle, Send, ArrowLeft, Star } from 'lucide-react';
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

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

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

    socketRef.current.on('location-update', (data) => {
      if (data.orderId === id) {
        setDeliveryLocation([data.lat, data.lng]);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
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
      
      // Set initial delivery location if available
      if (data.repartidor?.ubicacionActual) {
        setDeliveryLocation([
          data.repartidor.ubicacionActual.lat,
          data.repartidor.ubicacionActual.lng
        ]);
      }
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

  const getStatusInfo = (status) => {
    const statusMap = {
      recibido: { label: 'Recibido', color: 'bg-blue-500', icon: '📦' },
      preparando: { label: 'Preparando', color: 'bg-yellow-500', icon: '👨‍🍳' },
      en_camino: { label: 'En Camino', color: 'bg-purple-500', icon: '🏍️' },
      entregado: { label: 'Entregado', color: 'bg-green-500', icon: '✅' },
      cancelado: { label: 'Cancelado', color: 'bg-red-500', icon: '❌' }
    };
    return statusMap[status] || statusMap.recibido;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando seguimiento...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center">
        <p className="text-gray-400">Pedido no encontrado</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.estado);
  const clientLocation = [
    order.direccionEntrega.coordenadas.lat,
    order.direccionEntrega.coordenadas.lng
  ];

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="container mx-auto">
        <button
          onClick={() => navigate('/mis-pedidos')}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition mb-6"
        >
          <ArrowLeft size={20} />
          <span>Volver a Mis Pedidos</span>
        </button>

        <h1 className="text-5xl font-bangers text-yellow-500 mb-8">SEGUIMIENTO DE PEDIDO</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 overflow-hidden h-[500px]">
              <MapContainer
                center={clientLocation}
                zoom={14}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Your Location */}
                <Marker position={clientLocation}>
                  <Popup>
                    <div className="text-center">
                      <strong>📍 Tu Ubicación</strong>
                      <p className="text-sm">{order.direccionEntrega.calle} {order.direccionEntrega.numero}</p>
                    </div>
                  </Popup>
                </Marker>
                
                {/* Delivery Driver Location */}
                {deliveryLocation && order.estado === 'en_camino' && (
                  <Marker position={deliveryLocation} icon={deliveryIcon}>
                    <Popup>
                      <div className="text-center">
                        <strong>🏍️ Repartidor</strong>
                        <p className="text-sm">{order.repartidor?.nombre}</p>
                        <p className="text-xs">En camino...</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Order Info */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 p-6">
            <h3 className="text-xl font-bangers text-yellow-500 mb-4">ESTADO DEL PEDIDO</h3>
            
            <div className="flex items-center justify-center mb-6">
              <div className={`${statusInfo.color} px-6 py-3 rounded-full text-white font-bold text-lg flex items-center gap-2`}>
                <span>{statusInfo.icon}</span>
                <span>{statusInfo.label.toUpperCase()}</span>
              </div>
            </div>

            <div className="space-y-3">
              {['recibido', 'preparando', 'en_camino', 'entregado'].map((status, idx) => {
                const isCompleted = order.historialEstados.some(h => h.estado === status);
                const isCurrent = order.estado === status;
                const info = getStatusInfo(status);
                
                return (
                  <div key={status} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      isCompleted || isCurrent ? info.color : 'bg-zinc-700'
                    }`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isCompleted || isCurrent ? 'text-white' : 'text-gray-500'}`}>
                        {info.label}
                      </p>
                      {isCompleted && order.historialEstados.find(h => h.estado === status) && (
                        <p className="text-xs text-gray-400">
                          {new Date(order.historialEstados.find(h => h.estado === status).fecha).toLocaleString('es-MX')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Info */}
          {order.repartidor && (
            <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 p-6">
              <h3 className="text-xl font-bangers text-yellow-500 mb-4">TU REPARTIDOR</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-yellow-500 flex items-center justify-center text-3xl">
                  🏍️
                </div>
                <div>
                  <p className="font-bold text-lg">{order.repartidor.nombre}</p>
                  <p className="text-sm text-gray-400">
                    ⭐ {order.repartidor.calificacionPromedio?.toFixed(1) || '5.0'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-yellow-500" />
                  <span>{order.repartidor.telefono}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-yellow-500" />
                  <span className="capitalize">{order.repartidor.vehiculo || 'Vehículo'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Chat */}
          {order.repartidor && (
            <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 p-6">
              <button
                onClick={() => setShowChat(!showChat)}
                className="w-full flex items-center justify-between mb-4"
              >
                <h3 className="text-xl font-bangers text-yellow-500">CHAT CON REPARTIDOR</h3>
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
                          className={`mb-3 ${msg.tipoRemitente === 'cliente' ? 'text-right' : 'text-left'}`}
                        >
                          <div
                            className={`inline-block px-3 py-2 rounded-lg max-w-[80%] ${
                              msg.tipoRemitente === 'cliente'
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
          )}

          {/* Order Details */}
          <div className="bg-zinc-900 rounded-2xl border border-yellow-500/20 p-6">
            <h3 className="text-xl font-bangers text-yellow-500 mb-4">DETALLES DEL PEDIDO</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Número de Pedido:</span>
                <span className="font-bold">{order.numeroPedido}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total:</span>
                <span className="font-bold text-yellow-500">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Método de Pago:</span>
                <span className="font-bold capitalize">{order.metodoPago}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Productos:</span>
                <span className="font-bold">{order.productos.length} items</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default OrderTracking;
