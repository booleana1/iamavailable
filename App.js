import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import {COLORS} from "./src/styles/theme";
import SettingsScreen from "./src/screens/SettingScreen";

export default function App() {
  return (
      <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
          <SettingsScreen />
          <StatusBar style="auto" />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    containerSafeArea: {
        flex: 1,
        backgroundColor: COLORS.primary,
    }
})

