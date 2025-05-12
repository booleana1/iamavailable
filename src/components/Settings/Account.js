import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import AvatarPicker from '../AvatarPicker';
import CancelSaveButtons from "../CancelSaveButtons";
import InputField from "../InputField";
import {SETTINGS} from "../../styles/settings";
import { db } from '../../../firebase.config'
import {collection, getDoc, doc, getDocs, query, where, setDoc, updateDoc} from "firebase/firestore";

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const Account = ({loggedUserId}) => {

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [user, setUser] = useState({});
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const [newRole, setNewRole] = useState('');
    const [prevRoles, setPrevRoles] = useState([]);
    const [roles, setRoles] = useState([]);
    const [remRoles, setRemRoles] = useState([]);

    // get data
    useEffect(() => {
        const loadData = async () => {
            try{
                // get user data and set to state variable
                const userDataSnap = await getDoc(doc(db, 'users', String(loggedUserId)));
                const userData = userDataSnap.data();
                setUser(userData);

                // get ids of user roles
                const q = query(collection(db, 'user_has_role'), where("user_id","==", loggedUserId));
                const userRolesSnaps = await getDocs(q);
                const userRolesIds = userRolesSnaps.docs
                    // filter if is active
                    .filter(doc => doc.data()?.active)
                    .map((doc) => String(doc.data().role_id));

                // get roles names -> the if is needed because in where(field,'in',arr) the arr cannot ever be empty
                let userRolesNames = [];
                if (userRolesIds.length > 0) {
                    // get all the roles names
                    const rolesQuery = query(
                        collection(db, 'roles'),
                        where('__name__', 'in', userRolesIds)
                    );
                    const userRolesSnap = await getDocs(rolesQuery);
                    userRolesNames = userRolesSnap.docs
                        .map(doc => doc.data()?.role_name);
                }

                setRoles(userRolesNames);
                setPrevRoles(userRolesNames);
            }catch(err){
                console.log(err);
            }
        };
        loadData();
    }, [loggedUserId]);

    const addRole = () => {
        if (newRole.trim() && !roles.includes(newRole.trim())) {
            setRoles(prev => [...prev, newRole.trim()]);
            setNewRole('');
        }
    };

    const removeRole = roleToDelete => {
        setRoles(prev => prev.filter(r => r !== roleToDelete));
        if (roleToDelete.trim() && !remRoles.includes(roleToDelete.trim())) {
            setRemRoles(prev => [...prev, roleToDelete.trim()]);
        }
    };

    const handleCancel = () => {
        setName('');
        setUsername('');
        setRoles(prevRoles);
        setNewRole('');

        setFeedbackMessage('Changes discarded.');
        setTimeout(() => setFeedbackMessage(''), 3000);
    };

    const capitalize = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleSave = async () => {
        // update user
        const updatedUser = {
            name: name.trim() || user.name,
            hashtag: username.trim() || user.hashtag,
            photo_url: photoUrl
        };

        await setDoc(doc(db, 'users', String(loggedUserId)), updatedUser);

        // create roles/associate created roles with user
        for (const role of roles) {
            // if the role was already set to user, do nothing
            if(role in prevRoles) {continue;}

            // get new roles data from firebase
            const q = query(
                collection(db, 'roles'),
                where('role_name', '==', role)
            );
            const snap = await getDocs(q);

            // if the role doesn't exist, create
            let roleId;
            if (snap.empty) {
                const newRoleRef = doc(collection(db, 'roles'));
                await setDoc(newRoleRef, {
                    role_name: capitalize(role.trim()),
                    role_hashtag: role.trim().toLowerCase().replace(/\s+/g, '_')
                });
                // get roleId to search it in user_has_roles
                roleId = newRoleRef.id;
            } else {
                roleId = snap.docs[0].id;
            }
            // check if role is already in user_has_role, because as is not recommended to delete doc, it was implemented a field 'active'
            const userHasRoleQuery = query(
                collection(db, 'user_has_role'),
                where('user_id', '==', loggedUserId),
                where('role_id', '==', roleId)
            );
            const userHasRoleSnap = await getDocs(userHasRoleQuery);
            // if role is not in user_has_role:
            if (userHasRoleSnap.empty) {
                // create new
                const newUserRoleRef = doc(collection(db, 'user_has_role'));
                await setDoc(newUserRoleRef, {
                    user_id: loggedUserId,
                    role_id: roleId,
                    active: true,
                });
            } else {
                // update to active
                const existingDocRef = userHasRoleSnap.docs[0].ref;
                await updateDoc(existingDocRef, {
                    active: true
                });
            }
        }

        // delete roles TODO: corrigir
        for (const role of remRoles) {
            const q = query(
                collection(db, 'roles'),
                where('role_name', '==', role)
            );
            const snap = await getDocs(q);

            if (snap.empty) continue;

            const roleId = snap.docs[0].id;

            const userRoleQuery = query(
                collection(db, 'user_has_role'),
                where('user_id', '==', loggedUserId),
                where('role_id', '==', roleId)
            );
            const userRoleSnap = await getDocs(userRoleQuery);

            for (const docSnap of userRoleSnap.docs) {
                await updateDoc(docSnap.ref, {
                    active: false
                });
            }
        }


        setFeedbackMessage('Changes saved!');
        setTimeout(() => setFeedbackMessage(''), 3000);

        setPrevRoles(roles);
    };


    return (
        <ScrollView contentContainerStyle={SETTINGS.container}>
            <Text style={SETTINGS.title}>Account</Text>
            <Text style={SETTINGS.subtitle}>Profile</Text>
            <Text style={SETTINGS.description}>
                This information will be displayed publicly so be careful what you share
            </Text>

            <View style={styles.inputContainer}>
                <View>
                    <InputField
                        label="Name"
                        placeholder={user?.name || ''}
                        value={name}
                        onChangeText={setName}
                    />
                    <InputField
                        label="Username"
                        placeholder={user?.hashtag || ''}
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

            <CancelSaveButtons handleCancel={handleCancel} handleSave={handleSave} feedbackMessage={feedbackMessage} />

        </ScrollView>
    );
};

export default Account;

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
