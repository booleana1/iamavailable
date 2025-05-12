import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, StyleSheet} from 'react-native';
import {COLORS} from "./src/styles/theme";
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from "./src/screens/SettingScreen";
import MessageScreen from "./src/screens/MessageScreen";
import React, {useState} from "react";
import Header from "./src/components/Header";
import GroupScreen from "./src/screens/GroupScreen"

export default function App() {
    // define loggedUser for now
    const loggedUserId = 1;

    // do 'navigability' for now
    const [selected, setSelected] = useState('HomeScreen');

    return (
        <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
            <Header onChange={setSelected} loggedUserId={loggedUserId} />
            {/* data needed from the JSON file is sended by props to child */}
            {selected === 'HomeScreen' && <HomeScreen loggedUserId={loggedUserId}
            />}
            {selected === 'MessageScreen' && <MessageScreen loggedUserId={loggedUserId}
            />}
            {selected === 'SettingScreen' && <SettingsScreen loggedUserId={loggedUserId}
            />}
            {selected === 'GroupScreen' && <GroupScreen loggedUserId={loggedUserId}
            />}

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

