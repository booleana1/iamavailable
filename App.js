import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, StyleSheet} from 'react-native';
import {COLORS} from "./src/styles/theme";
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from "./src/screens/SettingScreen";
import MessageScreen from "./src/screens/MessageScreen";
import React, {useState} from "react";
import Header from "./src/components/Header";
import GroupScreen from "./src/screens/GroupScreen";
import initialData from "./src/data/initial_data";

export default function App() {

    // define loggedUser for now
    const loggedUserId = 1;

    // do 'navigability' for now
    const [selected, setSelected] = useState('HomeScreen');

    return (
        <SafeAreaView style={styles.containerSafeArea} edges={['top']}>
            <Header onChange={setSelected}/>

            {/* data needed from the JSON file is sended by props to child */}
            {selected === 'HomeScreen' && <HomeScreen loggedUserId={loggedUserId}
                                                      dataAvailabilities={initialData.availabilities}
                                                      dataUsers={initialData.users}
                                                      dataRoles={initialData.roles}
                                                      dataGroups={initialData.groups}
            />}
            {selected === 'MessageScreen' && <MessageScreen loggedUserId={loggedUserId}
                                                            data={initialData.private_messages}
                                                            dataUsers={initialData.users}
            />}
            {selected === 'SettingScreen' && <SettingsScreen loggedUserId={loggedUserId}
                                                             dataGroups={initialData.groups}
                                                             dataRoles={initialData.roles}
                                                             dataUsers={initialData.users}
                                                             dataUserHasRole={initialData.user_has_role}
            />}
            {selected === 'GroupScreen' && <GroupScreen loggedUserId={loggedUserId}
                                                        dataGroupMessages={initialData.group_messages}
                                                        dataAvailabilities={initialData.availabilities}
                                                        dataGroups={initialData.groups}
                                                        dataGroupUsers={initialData.group_users}
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

