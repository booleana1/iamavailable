import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import {COLORS} from '../styles/theme';
import AvatarPicker from './AvatarPicker';


const InputField = ({label, placeholder, value, onChangeText, onSubmitEditing}) => (
    <View style={styles.field}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#999"
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            returnKeyType="done"
        />
    </View>
);

const SettingsAccount = ({loggedUserId, dataUsers, dataUserHasRole, dataRoles, onSave, onCancel}) => {
    const user = dataUsers[loggedUserId];

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [prevRoles, setPrevRoles] = useState([]);
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState('');
    const [photoUrl, setPhotoUrl] = useState(user.photo_url);

    useEffect(()=>{

        const currentRoles = Object.values(dataUserHasRole)
            .filter(r => r.user_id === loggedUserId)
            .map(r => dataRoles[r.role_id].role_name)
            .filter(Boolean);

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
        // minimal update payload
        const updatedUser = {
            id: user.id,
            name: name.trim() || user.name,
            hashtag: username.trim() || user.hashtag,
            photo_url: photoUrl
        };

        // map role names to role objects (role_name + hashtag)
        const updatedRoles = roles.map(roleName => ({
            user_id: user.id,
            role_name: roleName,
            role_hashtag: roleName.toLowerCase()
                .replace(/\s+/g, '_')
        }));

        // hand off to parent via onSave
        onSave?.({
            user: updatedUser,
            roles: updatedRoles
        });

        // update prevRoles so cancel works after save
        setPrevRoles(roles);

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Account</Text>
            <Text style={styles.subtitle}>Profile</Text>
            <Text style={styles.description}>
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
            {/*TODO: make this  a component*/}
            <View style={styles.bottomContainer}>
                <View style={styles.line}></View>

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

export default SettingsAccount;


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingTop: 20
    },
    inputContainer: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 120,
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        color: COLORS.text
    },
    subtitle: {
        fontSize: 24,
        color: COLORS.text,
        marginTop: 40
    },
    description: {
        fontSize: 16,
        color: COLORS.text,
        marginVertical: 30
    },
    field: {
        marginBottom: 20
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 6
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
        fontWeight: '600'
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
        fontWeight: '600'
    },
});
