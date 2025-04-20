import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import CreateAvailability from './src/screens/CreateAvailabilityScreen';
import ProfileScreen from './src/screens/ProfileScreen';


export default function App() {
  return (
      <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
          <CreateAvailability/>
          <StatusBar style="auto" />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    containerSafeArea: {
        flex: 1,
    }
})

