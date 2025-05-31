import React from 'react';
import { View, StyleSheet } from 'react-native';
import FormsLogin from '../components/FormsLogin';
import { COLORS } from '../styles/theme';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FormsLogin navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

