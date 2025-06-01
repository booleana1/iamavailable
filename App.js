import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, StyleSheet} from 'react-native';
import {COLORS} from "./src/styles/theme";
import React, {useState} from "react";
import { NavigationContainer } from '@react-navigation/native';
import {UserProvider} from './src/context/UserContext';
import RootStack from "./src/navigation/RootStack";
import 'react-native-gesture-handler';


export default function App() {

    return (
        <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
            <UserProvider>
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

