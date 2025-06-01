import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView,} from 'react-native';
import CancelSaveButtons from "../CancelSaveButtons";
import InputField from "../InputField";
import {SETTINGS} from "../../styles/settings";
import { signInWithEmailAndPassword, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import { auth } from '../../../firebase.config';
import {useUser} from "../../context/UserContext";

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const Security = () => {
    const {loggedUserId} = useUser();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword]       = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleCancel = () => {
        setCurrentPassword('');
        setNewPassword('');

        setFeedbackMessage('Changes discarded.');
        setTimeout(() => setFeedbackMessage(''), 3000);
    };

    const login = async () => {
        try {
            const userCred = await signInWithEmailAndPassword(auth, "giuliadkvieira@gmail.com", "123456");
            const user = userCred.user;
            console.log("Logged:", user);
        } catch (err) {
            console.log("Erro login:", err);
        }
    };
    useEffect(() => {
        login();
    }, []);

    const handleSave = async () => {
        const user = auth.currentUser;

        if (!currentPassword || !newPassword) {
            setFeedbackMessage("Please fill in both fields.");
            return;
        }

        // TODO: take out
        const cred = EmailAuthProvider.credential("giuliadkvieira@gmail.com", currentPassword);

        try {
            // check current password
            await reauthenticateWithCredential(user, cred);

            await updatePassword(user, newPassword);
            setFeedbackMessage("Password updated successfully.");
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                setFeedbackMessage("Current password is incorrect.");
            }
            else{
                setFeedbackMessage("Error updating password: " + error.message);
            }

        }

        setTimeout(() => setFeedbackMessage(''), 3000);
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

            <CancelSaveButtons handleCancel={handleCancel} handleSave={handleSave} feedbackMessage={feedbackMessage}/>
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
