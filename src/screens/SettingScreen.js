import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Header from '../components/Header';
import SidePanel from '../components/SidePanel';

import SettingsAccount from '../components/SettingsAccount';
import SettingsSecurity from '../components/SettingsSecurity';
import SettingsNotifications from '../components/SettingsNotifications';
import {COLORS} from "../styles/theme";

export default function SettingsScreen() {
    const [selected, setSelected] = useState('Account');

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.body}>
                <SidePanel selected={selected} onChange={setSelected} />

                <View style={styles.content}>
                    {selected === 'Account' && <SettingsAccount />}
                    {selected === 'Security' && <SettingsSecurity />}
                    {selected === 'Notifications' && <SettingsNotifications />}

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
