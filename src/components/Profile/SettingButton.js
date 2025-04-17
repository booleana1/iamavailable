import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsButton({size}) {
  return (
    <TouchableOpacity style={styles.button}>
      <Ionicons name="settings-outline" size={size} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8, // pequeño padding para no hacerlo tiny
  },
});
