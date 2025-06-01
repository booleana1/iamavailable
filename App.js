import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {COLORS} from "./src/styles/theme";
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from "./src/screens/SettingScreen";
import MessageScreen from "./src/screens/MessageScreen";
import React, {useState} from "react";
import Header from "./src/components/Header";
import GroupScreen from "./src/screens/GroupScreen"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {UserProvider} from './src/context/UserContext';

const Stack = createNativeStackNavigator();

function RootStack() {
    return(
        <View style={{flex:1}}>
            <Header/>
            <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Messages" component={MessageScreen} />
                <Stack.Screen name="Groups" component={GroupScreen} />
                <Stack.Screen name="Profile" component={SettingsScreen} />
            </Stack.Navigator>
        </View>

    );
}

export default function App() {
    // define loggedUser for now
    const loggedUserId = 1;

    return (
        <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
            <UserProvider loggedUserId={loggedUserId}>
                <NavigationContainer>
                    <RootStack/>
                </NavigationContainer>
            </UserProvider>


            <StatusBar style="auto"/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerSafeArea: {
        flex: 1,
        backgroundColor: COLORS.primary,
    }
})

