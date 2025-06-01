import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsButton({size, style}) {
  return (
    <TouchableOpacity style={style}>
      <Ionicons name="settings-outline" size={size} color="white" />
    </TouchableOpacity>
  );
}


