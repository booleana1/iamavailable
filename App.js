import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
      <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
          <HomeScreen/>
          <StatusBar style="auto" />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    containerSafeArea: {
        flex: 1,
        backgroundColor: "#0099f9"
    }
})

