import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../styles/theme';

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const SidePanel = ({selected, onChange}) => {
    const OPTIONS = ['Account', 'Security', 'Notifications'];

    const handleSelect = useCallback(option => {
        onChange(option);
    }, [onChange]);


    const MenuButton = ({ option }) => (
        <TouchableOpacity
            onPress={() => handleSelect(option)}
            style={[
                styles.button,
                selected === option && styles.buttonSelected,
            ]}
        >
            <Text style={styles.buttonText}>{option}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>

            {OPTIONS.map(option => (
                <MenuButton key={option} option={option} />
            ))}
        </View>
    );
};

export default SidePanel;

// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({
    container: {
        width: 150,
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
