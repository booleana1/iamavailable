import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
//import RegisterScreen from './src/screens/RegisterScreen';
import GroupDetailsScreen from './src/screens/GroupDetailsScreen';

export default function App() {
  return (
      <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
          <GroupDetailsScreen/>
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

