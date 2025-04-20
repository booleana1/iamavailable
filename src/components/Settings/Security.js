import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { COLORS } from '../../styles/theme';
import CancelSaveButtons from "../CancelSaveButtons";
import InputField from "../InputField";
import {SETTINGS} from "../../styles/settings";


// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const Security = ({loggedUserId}) => {
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
        <ScrollView contentContainerStyle={SETTINGS.container}>
            <Text style={SETTINGS.title}>Security</Text>
            <Text style={SETTINGS.subtitle}>Password</Text>
            <Text style={SETTINGS.description}>Protect your privacy</Text>

            <View style={styles.formWrapper}>
                <InputField
                    label="Current password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={true}
                />
                <InputField
                    label="New password"
                    placeholder="New password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={true}
                />
            </View>

            <CancelSaveButtons handleCancel={handleCancel} handleSave={handleSave} />
        </ScrollView>
    );
};

export default Security;

// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({

    formWrapper: {
        width: 200,
    },

});
