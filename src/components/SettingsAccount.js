import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import {COLORS} from '../styles/theme';
import AvatarPicker from './AvatarPicker';
import CancelSaveButtons from "./CancelSaveButtons";
import InputField from "./InputField";
import {GLOBAL} from "../styles/global";


// ─────────────────────────────── UTILS ─────────────────────────────── //


const getCurrentRoles = (dataUserHasRole,loggedUserId,dataRoles) =>{
    return Object.values(dataUserHasRole)
        .filter(r => r.user_id === loggedUserId)
        .map(r => dataRoles[r.role_id].role_name)
        .filter(Boolean);
}
// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const SettingsAccount = ({loggedUserId, dataUsers, dataUserHasRole, dataRoles, onSave, onCancel}) => {
    const user = dataUsers[loggedUserId];

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [prevRoles, setPrevRoles] = useState([]);
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState('');
    const [photoUrl, setPhotoUrl] = useState(user.photo_url);

    useEffect(()=>{

        const currentRoles = getCurrentRoles(dataUserHasRole,loggedUserId,dataRoles)

        setRoles(currentRoles);
        setPrevRoles(currentRoles);
    },[loggedUserId, dataUserHasRole, dataRoles]);


    const addRole = () => {
        if (newRole.trim() && !roles.includes(newRole.trim())) {
            setRoles(prev => [...prev, newRole.trim()]);
            setNewRole('');
        }
    };

    const removeRole = roleToDelete => {
        setRoles(prev => prev.filter(r => r !== roleToDelete));
    };

    const handleCancel = () => {
        // Reset local changes
        setName('');
        setUsername('');
        setRoles(prevRoles);
        setNewRole('');
        onCancel?.();

    };

    const handleSave = () => {

        const updatedUser = {
            id: user.id,
            name: name.trim() || user.name,
            hashtag: username.trim() || user.hashtag,
            photo_url: photoUrl
        };


        const updatedRoles = roles.map(roleName => ({
            user_id: user.id,
            role_name: roleName,
            role_hashtag: roleName.toLowerCase()
                .replace(/\s+/g, '_')
        }));

        // send to parent via onSave
        onSave?.({
            user: updatedUser,
            roles: updatedRoles
        });

        // update prevRoles so cancel works after save
        setPrevRoles(roles);

    };

    return (
        <ScrollView contentContainerStyle={GLOBAL.settings_container}>
            <Text style={GLOBAL.title}>Account</Text>
            <Text style={GLOBAL.subtitle}>Profile</Text>
            <Text style={GLOBAL.description}>
                This information will be displayed publicly so be careful what you share
            </Text>

            <View style={styles.inputContainer}>
                <View>
                    <InputField
                        label="Name"
                        placeholder={user.name}
                        value={name}
                        onChangeText={setName}
                    />
                    <InputField
                        label="Username"
                        placeholder={user.hashtag}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View>
                    <InputField
                        label="Roles"
                        placeholder="Add role"
                        value={newRole}
                        onChangeText={setNewRole}
                        onSubmitEditing={addRole}
                    />

                    <View style={styles.chipsContainer}>
                        {roles.map(role => (
                            <View key={role} style={styles.chip}>
                                <Text style={styles.chipText}>{role}</Text>
                                <TouchableOpacity onPress={() => removeRole(role)} style={styles.removeIcon}>
                                    <Text style={styles.removeIconText}>×</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <View>
                <AvatarPicker
                    uri={photoUrl}          // current picture
                    onChange={setPhotoUrl}  // callback updates state
                    size={110}              // optional
                />
            </View>

            <CancelSaveButtons handleCancel={handleCancel} handleSave={handleSave} />

        </ScrollView>
    );
};

export default SettingsAccount;

// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({
    inputContainer: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 120,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginBottom: 8,
    },
    chipText: {
        fontSize: 12,
        color: '#333'
    },
    removeIcon: {
        marginLeft: 6
    },
    removeIconText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666'
    },

});
