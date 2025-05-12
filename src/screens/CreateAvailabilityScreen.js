import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Form from '../components/Availability/AvailabilityForm';
import { COLORS } from '../styles/theme';

export default function CreateAvailabilityScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Form />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
