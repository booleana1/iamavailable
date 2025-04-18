import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { COLORS } from '../styles/theme';
// TODO: review code
const InputField = ({ label, placeholder, value, onChangeText }) => (
    <View style={styles.field}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#999"
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry
        />
    </View>
);

const SettingsSecurity = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword]       = useState('');

    const handleCancel = () => {
        setCurrentPassword('');
        setNewPassword('');
        alert('Changes discarded');
    };

    const handleSave = () => {
        // TODO: call API / validation
        console.log({ currentPassword, newPassword });
        alert('Password updated! Check console.');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Security</Text>
            <Text style={styles.subtitle}>Password</Text>
            <Text style={styles.description}>Protect your privacy</Text>

            <View style={styles.formWrapper}>
                <InputField
                    label="Current password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                />
                <InputField
                    label="New password"
                    placeholder="New password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.line} />

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default SettingsSecurity;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 24,
        color: COLORS.text,
        marginTop: 40,
    },
    description: {
        fontSize: 16,
        color: COLORS.text,
        marginVertical: 30,
    },
    formWrapper: {
        width: 200,
    },
    field: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 6,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 14,
        height: 40,
        borderColor: '#c2c2c2',
        borderWidth: 1,
    },
    bottomContainer: {
        width: '60%',
        marginTop: 40,
        alignItems: 'flex-end',
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: COLORS.gray,
    },
    buttonRow: {
        width: '40%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        marginTop: 40,
    },
    cancelButton: {
        flex: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        borderWidth: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        flex: 1,
        backgroundColor: COLORS.success,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
