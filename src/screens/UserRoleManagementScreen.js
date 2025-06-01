import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import BlurredGroupManagement from '../components/BlurredGroupManagement';
import { COLORS } from '../styles/theme';

export default function UserRoleManagementScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      <Header />
      <BlurredGroupManagement navigation={navigation} route={route} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
