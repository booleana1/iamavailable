import { View, StyleSheet } from 'react-native';
import FormsForgotPassword from '../components/FormsForgotPassword';
import { COLORS } from '../styles/theme';

export default function ForgotPasswordScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FormsForgotPassword navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
