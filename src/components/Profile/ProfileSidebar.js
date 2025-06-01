import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../styles/theme';
import SettingButton from './SettingButton';
import {Ionicons} from "@expo/vector-icons";
import {useUser} from "../../context/UserContext";

const SidePanel = () => {
    const { logout } = useUser();

    /* ---------- handler de logout ---------- */
    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            alert('Não foi possível sair.');
        }
    };

    return (
        <View style={styles.container}>
            <SettingButton size={64} style={styles.button} />
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={64} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default SidePanel;


const styles = StyleSheet.create({
    container: {
        width: 160,
        height: '100%',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingTop: 40,
        justifyContent: 'space-evenly',
    },
    header: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 8,
    },
    buttonSelected: {
        backgroundColor: COLORS.secondary,
        paddingVertical: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '400',
        fontSize: 18,
    },
});
