import React from 'react';
import { View, StyleSheet } from 'react-native';
import Forms from '../components/Forms';
import { COLORS } from '../styles/theme';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Forms  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
