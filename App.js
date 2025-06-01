import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import CreateAvailability from './src/screens/CreateAvailabilityScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import AvailabilityDetailsScreen from './src/screens/AvailabilityDetailsScreen';
import OthersProfileScreen from './src/screens/OthersProfileScreen';
import ManageAvailabilityScreen from './src/screens/ManageAvailabilityScreen';


export default function App() {
  return (
      <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
          <ManageAvailabilityScreen availabilityId="8" />
          <StatusBar style="auto" />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    containerSafeArea: {
        flex: 1,
    }
})

