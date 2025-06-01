import { View, StyleSheet } from 'react-native';
import FormsRecoverPasswordScreen from '../components/FormsRecoverPasswordScreen';
import { COLORS } from '../styles/theme';

export default function RecoverPasswordScreen({ navigation, route }) {
  const { email } = route.params || {};

  return (
    <View style={styles.container}>
      <FormsRecoverPasswordScreen navigation={navigation} email={email} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
