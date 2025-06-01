import { createNativeStackNavigator } from "@react-navigation/native-stack";AuthStack
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import React from "react";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import RecoverPasswordScreen from "../screens/RecoverPasswordScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} id="AuthStack">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} />

        </Stack.Navigator>
    );
}
