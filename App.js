import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import CreateAvailability from './src/screens/CreateAvailabilityScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import AvailabilityDetailsScreen from './src/screens/AvailabilityDetailsScreen';


export default function App() {
  return (
      <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
          <SearchScreen/>
          <StatusBar style="auto" />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    containerSafeArea: {
        flex: 1,
    }
})

