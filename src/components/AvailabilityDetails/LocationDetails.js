import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';

// Icono para el marcador
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LocationDetails({ availabilityId }) {
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const availabilityDoc = await getDoc(doc(db, 'availabilities', availabilityId));
        const availabilityData = availabilityDoc.data();
        if (!availabilityData) return;
        setAvailability(availabilityData);
      } catch (error) {
        console.error("Error loading availability:", error);
      }
    };

    fetchAvailability();
  }, [availabilityId]);

  if (!availability) {
    return <Text style={styles.errorText}>Loading...</Text>;
  }

  const hasCoords = availability.latitude !== null && availability.longitude !== null;
  const defaultCenter = [41.79648, -6.76942];
  const location = hasCoords
    ? [availability.latitude, availability.longitude]
    : defaultCenter;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>

      {/* Map */}
      <MapContainer
        center={location}
        zoom={16}
        scrollWheelZoom={false}
        style={styles.map}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {hasCoords && <Marker position={location} icon={markerIcon} />}
      </MapContainer>

      {!hasCoords && <Text style={styles.note}>Not geolocated</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '25%',
    alignItems: 'center',
    right: 0,
    width: '40%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 8,
    zIndex: 10,
  },
  map: {
    width: '100%',
    height: '70%',
    borderRadius: 8,
    marginTop: '10%',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  note: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 40,
    fontSize: 16,
    textAlign: 'center',
  },
});
