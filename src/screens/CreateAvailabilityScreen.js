import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Header from '../components/Header';
import Calendar from '../components/Availability/CalendarComp';
import Map from '../components/Availability/MeetingMap';
import { COLORS } from '../styles/theme';

export default function ProfileScreen() {
  // Mostrar la alerta cuando se monta el componente
  useEffect(() => {
    Alert.alert(
      '¡Bienvenido!',
      'Esta es una alerta que aparece al cargar la pantalla.',
      [{ text: 'OK' }]
    );
  }, []); // El array vacío significa que se ejecutará solo una vez, cuando el componente se monte

  return (
    <View style={styles.container}>
      <Header />
      <Calendar />
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
