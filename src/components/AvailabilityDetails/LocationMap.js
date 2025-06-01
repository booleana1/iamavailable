import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para íconos de Leaflet cuando se usa con webpack o Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

export default function LocationMap({ latitude, longitude }) {
  const hasValidCoords =
    typeof latitude === 'number' && !isNaN(latitude) &&
    typeof longitude === 'number' && !isNaN(longitude);

  const position = hasValidCoords
    ? { lat: latitude, lng: longitude }
    : { lat: 41.79648, lng: -6.76942 }; // Posición por defecto

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>Ubicación registrada</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
