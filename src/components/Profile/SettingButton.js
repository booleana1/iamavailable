import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useNavigation} from "@react-navigation/native";

export default function SettingsButton({size, style}) {
    const navigation = useNavigation();
  return (
    <TouchableOpacity style={style} onPress={()=> navigation.navigate('Settings')}>
      <Ionicons name="settings-outline" size={size} color="white" />
    </TouchableOpacity>
  );
}


