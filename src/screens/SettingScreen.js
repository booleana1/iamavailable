import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import SidePanel from '../components/Settings/SidePanel';
import Account from '../components/Settings/Account';
import Security from '../components/Settings/Security';
import Notifications from '../components/Settings/Notifications';
import {COLORS} from "../styles/theme";



export default function SettingsScreen({loggedUserId, dataGroups, dataRoles, dataUsers}) {
    const [selected, setSelected] = useState('Account');

    return (
        <View style={styles.container}>

            <View style={styles.body}>
                <SidePanel selected={selected} onChange={setSelected}/>

                <View style={styles.content}>
                    {selected === 'Account' && <Account loggedUserId={loggedUserId}/>}
                    {selected === 'Security' && <Security loggedUserId={loggedUserId}/>}
                    {selected === 'Notifications' && <Notifications loggedUserId={loggedUserId}
                                                                    dataGroups={dataGroups}
                                                                    dataRoles={dataRoles}
                                                                    dataUsers={dataUsers}
                    />}

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    body: {
        flex: 1,
        flexDirection: 'row'
    },
    content: {
        flex: 1,
        padding: 16
    },
});
