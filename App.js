import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
//import RegisterScreen from './src/screens/RegisterScreen';
//import LoginScreen from './src/screens/LoginScreen';
//import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
//import RecoverPasswordScreen from './src/screens/RecoverPasswordScreen';
//import GroupDetailsScreen from './src/screens/GroupDetailsScreen';
import GroupManagementScreen from './src/screens/GroupManagementScreen';
//import CreateGroupsScreen from './src/screens/CreateGroupsScreen';


export default function App() {
  return (
      <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
          <GroupManagementScreen/>
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

