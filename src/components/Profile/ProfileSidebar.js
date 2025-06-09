import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../styles/theme';
import SettingButton from './SettingButton';



const SidePanel = ({selected, onChange}) => {


    return (
        <View style={styles.container}>
            <SettingButton size={64} style = {styles.button}/>
        </View>
    );
};

export default SidePanel;


const styles = StyleSheet.create({
    container: {
        width: '15%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingTop: 40,
        gap: 30,
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
        marginTop:'200%'
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
