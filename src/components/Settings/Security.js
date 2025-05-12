import React, { useState } from 'react';
import {StyleSheet, Text, View, ScrollView,} from 'react-native';
import CancelSaveButtons from "../CancelSaveButtons";
import InputField from "../InputField";
import {SETTINGS} from "../../styles/settings";
import { updatePassword } from "firebase/auth";
import { auth } from '../../../firebase.config';


// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const Security = ({loggedUserId}) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword]       = useState('');

    const handleCancel = () => {
        setCurrentPassword('');
        setNewPassword('');
        alert('Changes discarded');
    };

    const handleSave = async () => {
        const user = auth.currentUser;

        if (!user) {
            alert("Usuário não autenticado.");
            return;
        }

        try {
            await updatePassword(user, newPassword);
            alert("Senha atualizada com sucesso.");
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                alert("Por segurança, você precisa fazer login novamente.");
            } else {
                alert("Erro ao atualizar a senha: " + error.message);
            }
        }
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
