import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, StyleSheet} from 'react-native';
import {COLORS} from "./src/styles/theme";
import React, {useContext, useState} from "react";
import { NavigationContainer } from '@react-navigation/native';
import {UserContext, UserProvider} from './src/context/UserContext';
import RootStack from "./src/navigation/RootStack";
import 'react-native-gesture-handler';
import AuthStack from "./src/navigation/AuthStack";

function AppNavigation() {
    const { loggedUserId } = useContext(UserContext); // Ex: null se não logado

    return (
        <>
            {loggedUserId ? <RootStack /> : <AuthStack />}
        </>
    );
}


export default function App() {

    return (
        <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
            <UserProvider>
                <NavigationContainer>
                    <AppNavigation />
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
