import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom yellow marker
const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker position={position} icon={yellowIcon}>
      <Popup>
        Tu ubicación seleccionada<br />
        <small>Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}</small>
      </Popup>
    </Marker>
  ) : null;
}

const MapSelector = ({ initialPosition = [19.4326, -99.1332], onLocationChange }) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    if (onLocationChange) {
      onLocationChange(position);
    }
  }, [position, onLocationChange]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border-2 border-yellow-500/30">
      <MapContainer
        center={position}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <div className="bg-zinc-800 p-3 flex items-center gap-2 text-sm text-gray-300">
        <MapPin size={16} className="text-yellow-500" />
        <span>Haz click en el mapa para seleccionar tu ubicación</span>
      </div>
    </div>
  );
};

export default MapSelector;
