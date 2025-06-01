import React, { Component } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para íconos de Leaflet en entornos como Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Componente interno para detectar clics en el mapa
function LocationPicker({ onMove }) {
  useMapEvents({
    click(e) {
      onMove(e.latlng);
    },
  });
  return null;
}

export default class LocationMapEditor extends Component {
  constructor(props) {
    super(props);
    const { latitude, longitude } = props;

    this.state = {
      position: {
        lat: latitude ?? 41.79648,
        lng: longitude ?? -6.76942,
      },
    };
  }

  handleMarkerDrag = (e) => {
    const newPos = e.target.getLatLng();
    this.setState({ position: newPos });
    this.notifyParent(newPos);
  };

  handleMapClick = (latlng) => {
    this.setState({ position: latlng });
    this.notifyParent(latlng);
  };

  notifyParent = (coords) => {
    if (this.props.onLocationChange) {
      this.props.onLocationChange(coords.lat, coords.lng);
    }
  };

  render() {
    const { position } = this.state;

    const containerStyle = {
      height: '400px',
      width: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    };

    const mapStyle = {
      height: '100%',
      width: '100%',
    };

    return (
      <div style={containerStyle}>
        <MapContainer
          center={position}
          zoom={15}
          style={mapStyle}
          scrollWheelZoom={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={position}
            draggable
            eventHandlers={{ dragend: this.handleMarkerDrag }}
          />
          <LocationPicker onMove={this.handleMapClick} />
        </MapContainer>
      </div>
    );
  }
}
