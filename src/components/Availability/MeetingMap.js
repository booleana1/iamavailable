import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const coords = e.latlng;
      setPosition(coords);
      onSelect(coords);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function LocationMap({ onLatitudeChange, onLongitudeChange }) {
  const handleSelect = ({ lat, lng }) => {
    onLatitudeChange(lat);
    onLongitudeChange(lng);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Title}>Location</Text>
      <MapContainer
        center={[41.79648, -6.76942]}
        zoom={16}
        scrollWheelZoom={false}
        style={styles.map}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker onSelect={handleSelect} />
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '90%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  Title: {
    fontSize: 20,
    marginBottom: 10,
  },
});
