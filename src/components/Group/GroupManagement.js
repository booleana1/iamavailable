import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Switch,
    FlatList, Button,
} from 'react-native';
import {db} from '../../../firebase.config';
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    getDoc, setDoc, writeBatch,
} from 'firebase/firestore';
import {useUser} from '../../context/UserContext';
import DoneButton from "../DoneButton";
import InputField from "../InputField";
import {COLORS, GLOBAL} from "../../styles/theme";
import {Ionicons} from "@expo/vector-icons";

export default function GroupManagement({route, navigation}) {
    const {groupId} = route.params;
    const {loggedUserId} = useUser();

    const [name, setName] = useState('');
    const [hashtag, setHashtag] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [autoAdmission, setAutoAdmission] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [ownerId, setOwnerId] = useState(0);

    /*ROLES*/
    const [newRole, setNewRole] = useState({id: '', name: '', hashtag: ''});
    const [prevRoles, setPrevRoles] = useState({id: '', name: '', hashtag: ''});
    const [roles, setRoles] = useState([]);
    const [remRoles, setRemRoles] = useState([]);

    useEffect(() => {
        const loadGroupData = async () => {
            const groupSnap = await getDoc(doc(db, 'groups', groupId));

            if (!groupSnap.exists()) {
                alert('Group not found');
                return;
            }

            const groupData = groupSnap.data();
            setSelectedGroupId(groupSnap.id);
            setName(groupData.name);
            setHashtag(groupData.hashtag);
            setDescription(groupData.description);
            setIsPublic(groupData.is_public);
            setAutoAdmission(groupData.auto_admission);
            const ownerId= String(groupData.user_id);

            loadUsers(groupSnap.id, ownerId);



            /*ROLES*/
            const rolesSnap = await getDocs(
                collection(db, 'groups', String(groupId), 'roles')
            );

            const rolesData = rolesSnap.docs
                .map((d) => {
                    return {
                        name: d.data().name,
                        hashtag: d.data().hashtag,
                        active: d.data().active,
                    };
                })

            setRoles(rolesData);
            setPrevRoles(rolesData);
        };

        loadGroupData();
    }, [groupId]);

    const loadUsers = async (groupId, ownerId) => {
        const strGroupId = String(groupId);

        const approvedQuery = query(
            collection(db, 'group_users'),
            where('group_id', '==', strGroupId),
            where('status', '==', 'approved')
        );
        const approvedSnap = await getDocs(approvedQuery);
        const approvedUserIds = [ ownerId, ...approvedSnap.docs.map((doc) => doc.data().user_id)];


        const pendingQuery = query(
            collection(db, 'group_users'),
            where('group_id', '==', strGroupId),
            where('status', '==', 'pending')
        );
        const pendingSnap = await getDocs(pendingQuery);
        const pendingUserIds = pendingSnap.docs.map((doc) => doc.data().user_id);
        const userNames = await fetchUserNames([ownerId,...approvedUserIds, ...pendingUserIds]);

        const approvedUsersData = [{user_id:ownerId,name: userNames[ownerId]},...approvedSnap.docs.map((doc) => {
            const userData = doc.data();
            return {id: doc.id, ...userData, name: userNames[userData.user_id]};
        })];
        console.log(approvedUsersData);

        const pendingUsersData = pendingSnap.docs.map((doc) => {
            const userData = doc.data();
            return {id: doc.id, ...userData, name: userNames[userData.user_id]};
        });
        setApprovedUsers(approvedUsersData);
        setPendingUsers(pendingUsersData);
    };


    const fetchUserNames = async (userIds) => {
        const userNames = {};

        for (const userId of userIds) {
            const userRef = doc(db, 'users', String(userId));
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                userNames[userId] = userSnap.data().name;
            }
        }

        return userNames;
    };

    /*ROLES*/
    const addRole = () => {
        const name = newRole.name.trim();
        const hashtag = newRole.hashtag.trim();
        if (!name && !hashtag) {
            return
        }

        if (
            name &&
            hashtag &&
            !roles.some(role =>
                role.name.toLowerCase() === name.toLowerCase() ||
                role.hashtag.toLowerCase() === hashtag.toLowerCase()
            )
        ) {
            setRoles(prev => [...prev, newRole]);
            setNewRole({name: '', hashtag: ''});
        }
    };

    const removeRole = (roleToDelete) => {
        setRoles(prev =>
            prev.filter(r => r.hashtag !== roleToDelete)
        );

        if (roleToDelete && !remRoles.includes(roleToDelete)) {
            setRemRoles(prev => [...prev, roleToDelete]);
        }
    };

    /*change name e hashtag do useState*/
    const handleNameChange = (text) =>
        setNewRole((prev) => ({...prev, name: text}));

    const handleHashtagChange = (text) =>
        setNewRole((prev) => ({...prev, hashtag: text}));

    const syncRoles = async () => {
        const colRef = collection(db, 'groups', String(groupId), 'roles');
        const batch  = writeBatch(db);

        roles.forEach((r) => {
            const roleRef = doc(colRef, r.hashtag); // id = hashtag
            batch.set(roleRef, {
                name:    r.name,
                hashtag: r.hashtag,
                active:  true,
            }, { merge: true });
        });

        remRoles.forEach((hashtag) => {
            const roleRef = doc(colRef, hashtag);
            batch.update(roleRef, { active: false });
        });

        await batch.commit();
    };


    const handleSubmit = async () => {
        if (!selectedGroupId) {
            console.error('No group selected');
            return;
        }

        setLoading(true);
        try {
            const groupRef = doc(db, 'groups', selectedGroupId);
            await updateDoc(groupRef, {
                name,
                hashtag,
                description,
                is_public: isPublic,
                auto_admission: autoAdmission,
            });

            await syncRoles();

            setFeedbackMessage('Group updated successfully!');

        } catch (error) {
            console.error('Error updating group:', error);
            setFeedbackMessage('Error updating group.');
        } finally {
            setLoading(false);
            setTimeout(() => setFeedbackMessage(''), 3000);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                <Text style={styles.title}>GROUP SETTINGS</Text>

                <View style={styles.contentRow}>
                    <View style={styles.formContainer}>
                        <View style={styles.row}>
                            <View style={styles.rowItem}>
                                <Text style={styles.label}>Name</Text>
                                <TextInput
                                    placeholder="Name"
                                    value={name}
                                    onChangeText={setName}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.rowItem}>
                                <Text style={styles.label}>Hashtag</Text>
                                <TextInput
                                    placeholder="Hashtag"
                                    value={hashtag}
                                    onChangeText={setHashtag}
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.rowItemFull}>
                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    placeholder="Description"
                                    value={description}
                                    onChangeText={setDescription}
                                    style={styles.input}
                                    multiline
                                />
                            </View>
                        </View>

                        {/*ROLES*/}

                        <View>
                            <Text style={styles.tableTitle}>Roles</Text>
                            <View style={{flexDirection: "row", gap: 20}}>
                                <InputField
                                    label="Role name"
                                    placeholder="Insert role name"
                                    value={newRole.name}
                                    onChangeText={handleNameChange}
                                />
                                <InputField
                                    label="Role hashtag"
                                    placeholder="Insert role hashtag"
                                    value={newRole.hashtag}
                                    onChangeText={handleHashtagChange}
                                />

                                <DoneButton style={{justifyContent:"center", alignItems:"center", alignSelf:"center"}} onPress={addRole}/>

                            </View>


                            <View style={styles.chipsContainer}>
                                {roles.map(role => (
                                    <View key={role.hashtag} style={styles.chip}>
                                        <Text style={styles.chipText}>{role.name}</Text>
                                        <TouchableOpacity onPress={() => removeRole(role.hashtag)}
                                                          style={styles.removeIcon}>
                                            <Text style={styles.removeIconText}>×</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* END ROLES*/}


                        <View style={styles.row}>
                            <View style={styles.rowItem}>
                                <Text style={styles.label}>Public/Private</Text>
                                <View style={styles.switchContainer}>
                                    <Text>Private</Text>
                                    <Switch value={isPublic} onValueChange={setIsPublic}/>
                                    <Text>Public</Text>
                                </View>
                            </View>
                            <View style={styles.rowItem}>
                                <Text style={styles.label}>Self-admission</Text>
                                <View style={styles.switchContainer}>
                                    <Text>No</Text>
                                    <Switch value={autoAdmission} onValueChange={setAutoAdmission}/>
                                    <Text>Yes</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.doneButton} onPress={handleSubmit} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="white"/>
                            ) : (
                                <Text style={styles.doneButtonText}>Save Changes</Text>
                            )}
                        </TouchableOpacity>

                        {feedbackMessage ? <Text style={styles.feedback}>{feedbackMessage}</Text> : null}
                    </View>

                    <View style={styles.rightSection}>
                        <View style={styles.usersTable}>
                            <View style={styles.userHeader}>
                                <Text style={styles.tableTitle}>Users</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('AddUser')}>
                                    <Text style={styles.plusSign}>+</Text>
                                </TouchableOpacity>
                            </View>
                            {approvedUsers.length === 0 ? (
                                <Text style={styles.noDataText}>No approved users</Text>
                            ) : (
                                <FlatList
                                    data={approvedUsers}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({item}) => (
                                        <View style={styles.userItem}>
                                            <Text style={styles.userText}>{item.name}</Text>
                                            <TouchableOpacity
                                                style={styles.plusButton}
                                                onPress={() =>
                                                    navigation.navigate('GroupEditMembers', {
                                                        userId: item.user_id,
                                                        groupId: groupId
                                                    })
                                                }
                                            >
                                                <Ionicons name="pencil" size={20} color={COLORS.text} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            )}
                        </View>

                        <View style={styles.requestsTable}>
                            <Text style={styles.tableTitle}>Requests</Text>
                            {pendingUsers.length === 0 ? (
                                <Text style={styles.noDataText}>There are no requests</Text>
                            ) : (
                                <FlatList
                                    data={pendingUsers}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({item}) => (
                                        <View style={styles.userItem}>
                                            <Text style={styles.userText}>{item.name}</Text>
                                            <TouchableOpacity
                                                style={styles.plusButton}
                                                onPress={() =>
                                                    navigation.navigate('GroupRequests', {
                                                        userId: item.user_id,
                                                        groupId: groupId
                                                    })
                                                }
                                            >
                                                <Ionicons name="pencil" size={20} color={COLORS.text} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </View>
            <DoneButton style={{position: 'absolute', bottom: 40, right: 40,}} onPress={() => navigation.goBack()}/>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
    },
    mainContent: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    formContainer: {
        width: '60%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    rightSection: {
        width: '35%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    rowItem: {
        width: '45%',
        marginRight: 20,
    },
    rowItemFull: {
        width: '100%',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingLeft: 10,
        fontSize: 16,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    doneButton: {
        backgroundColor: '#00d084',
        width: '100%',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    doneButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    feedback: {
        marginTop: 10,
        textAlign: 'center',
        color: 'green',
    },
    usersTable: {
        marginBottom: 20,
    },
    requestsTable: {
        marginBottom: 20,
    },
    tableTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    plusButton: {
        marginLeft: 5,
    },
    plusSign: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    userText: {
        fontSize: 16,
    },
    noDataText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#666',
    },

    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
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
