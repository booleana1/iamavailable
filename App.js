import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import RecoverPasswordScreen from './src/screens/RecoverPasswordScreen';
import GroupDetailsScreen from './src/screens/GroupDetailsScreen';
import GroupDontBelongScreen from './src/screens/GroupDontBelongScreen';
import GroupManagementScreen from './src/screens/GroupManagementScreen';
import UserRoleManagementScreen from './src/screens/UserRoleManagementScreen';
import CreateGroupsScreen from './src/screens/CreateGroupsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} />
        <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
        <Stack.Screen name="GroupDontBelong" component={GroupDontBelongScreen} />
        <Stack.Screen name="GroupManagement" component={GroupManagementScreen} />
        <Stack.Screen name="UserRoleManagement" component={UserRoleManagementScreen} />
        <Stack.Screen name="CreateGroups" component={CreateGroupsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
