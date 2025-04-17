// SelectLocationMap.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icono para el marcador
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? (
    <Marker position={position} icon={markerIcon} />
  ) : null;
};

export default function SelectLocationMap() {
  const [position, setPosition] = useState(null);

  return (
    <View style={styles.container}>
        <Text style = {styles.Title}>Location</Text>
        <MapContainer
          center={[41.79648, -6.76942]}
          zoom={16}
          scrollWheelZoom={false}
          style={styles.map}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      
      {position && (
        <Text style={styles.coords}>
          Lat: {position.lat.toFixed(5)} | Lng: {position.lng.toFixed(5)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    right: 150,
    bottom:200,
    width: '40%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    marginLeft:'50%',
    width: '60%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  coords: {
    marginTop: 10,
    fontSize: 14,
    color: 'black',
  },
  Title:{
    fontSize:20
  }
});
