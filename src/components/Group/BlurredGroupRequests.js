import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    serverTimestamp,
    query,
    where,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../../firebase.config';

export default function GroupMemberRequestModal() {
    const navigation = useNavigation();
    const { params } = useRoute();
    const { userId, groupId } = params || {};

    const [visible, setVisible] = useState(true);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);
    const [groupUserDoc, setGroupUserDoc] = useState(null); // doc snapshot of group_users item

    const [groupRoles, setGroupRoles] = useState([]); // [{ hashtag, name }]
    const [userRoles, setUserRoles] = useState([]); // roles array from group_users doc
    const [selectedRole, setSelectedRole] = useState('');

    /* ---------------- fetch initial data ---------------- */
    useEffect(() => {
        if (!userId || !groupId) return;

        (async () => {
            try {
                // user doc
                const userSnap = await getDoc(doc(db, 'users', String(userId)));
                if (userSnap.exists()) setUser(userSnap.data());

                // group_users doc where user_id == userId
                const groupUserQuery = query(
                    collection(db,  'group_users'),
                    where('user_id', '==', String(userId))
                );
                const groupUserSnaps = await getDocs(groupUserQuery);
                if (!groupUserSnaps.empty) {
                    const first = groupUserSnaps.docs[0];
                    setGroupUserDoc(first);
                }
                const userRoleSnap = await getDoc(
                    doc(db, 'groups', String(groupId), 'user_roles', String(userId))
                );
                if (userRoleSnap.exists()) {
                    const { roles = [] } = userRoleSnap.data();
                    setUserRoles(roles);
                }

                // roles available in group
                const rolesSnap = await getDocs(collection(db, 'groups', String(groupId), 'roles'));
                setGroupRoles(rolesSnap.docs.map((d) => ({ hashtag: d.id, name: d.data().name })));
            } catch (err) {
                console.error(err);
                Alert.alert('Error', 'Failed to load data.');
            } finally {
                setLoading(false);
            }
        })();
    }, [userId, groupId]);

    const status = groupUserDoc?.data()?.status || 'pending';
    const requestMessage = groupUserDoc?.data()?.request_message || '-';

    /* ---------------- helpers ---------------- */
    const saveRoles = async (rolesArr) => {
        if (!groupUserDoc) return;
        await setDoc(
            doc(db, 'groups', String(groupId), 'user_roles', String(userId)),
            {roles: rolesArr, updatedAt: serverTimestamp()},
            {merge: true}
        );    };

    const addRole = async () => {
        if (status !== 'approved') return; // only if approved
        if (!selectedRole || userRoles.includes(selectedRole)) return;
        const updated = [...userRoles, selectedRole];
        try {
            await saveRoles(updated);
            setUserRoles(updated);
        } catch {
            Alert.alert('Error', 'Could not add role.');
        }
    };

    const removeRole = async (tag) => {
        if (status !== 'approved') return;
        const updated = userRoles.filter((r) => r !== tag);
        try {
            await saveRoles(updated);
            setUserRoles(updated);
        } catch {
            Alert.alert('Error', 'Could not remove role.');
        }
    };

    const updateRequestStatus = async (newStatus) => {
        if (!groupUserDoc) return;
        try {
            await updateDoc(groupUserDoc.ref, { status: newStatus, updatedAt: serverTimestamp() });
            setGroupUserDoc({ ...groupUserDoc, data: () => ({ ...groupUserDoc.data(), status: newStatus }) });
            if (newStatus === 'approved' && !userRoles.length) {
                await saveRoles();
                setUserRoles();
            }
        } catch {
            Alert.alert('Error', 'Action failed');
        }
    };

    const closeModal = () => {
        setVisible(false);
        navigation.goBack();
    };

    /* ---------------- UI ---------------- */
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Modal visible={visible} animationType="slide" transparent onRequestClose={closeModal}>
                <View style={styles.backdrop}>
                    <View style={styles.modalView}>
                        {user ? (
                            <>
                                {/* Nome e hashtag */}
                                <Text style={styles.title}>{user.name}</Text>
                                <Text style={styles.subtitle}>@{user.hashtag}</Text>

                                {/* Mensagem de pedido */}
                                <Text style={styles.section}>Request</Text>
                                <Text style={styles.requestMsg}>{requestMessage}</Text>

                                {/* Approve / Reject se pendente */}
                                {status !== 'approved'  && (
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#0a7' }]} onPress={() => updateRequestStatus('approved')}>
                                            <Ionicons name="checkmark" size={20} color="#fff" />
                                            <Text style={styles.actionTxt}>Approve</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#d33' }]} onPress={() => updateRequestStatus('rejected')}>
                                            <Ionicons name="close" size={20} color="#fff" />
                                            <Text style={styles.actionTxt}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Status */}
                                <Text style={styles.status}>Status: {status}</Text>

                                {/* Roles somente aprovado */}
                                {status === 'approved' && (
                                    <>
                                        <Text style={styles.section}>Roles</Text>
                                        {userRoles.length ? (
                                            <View style={styles.badgeWrap}>
                                                {userRoles.map((tag) => (
                                                    <View key={tag.hashtag} style={styles.badge}>
                                                        <Text style={styles.badgeText}>{tag}</Text>
                                                        <TouchableOpacity onPress={() => removeRole(tag)}>
                                                            <Ionicons name="close-circle" size={16} color="#888" />
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </View>
                                        ) : (
                                            <Text style={styles.noneTxt}>No roles yet</Text>
                                        )}

                                        <Picker selectedValue={selectedRole} onValueChange={setSelectedRole} style={styles.picker}>
                                            <Picker.Item label="Select..." value="" />
                                            {groupRoles.map((r) => (
                                                <Picker.Item key={r.hashtag} label={`${r.name} (${r.hashtag})`} value={r.hashtag} />
                                            ))}
                                        </Picker>
                                        <TouchableOpacity style={styles.addBtn} onPress={addRole}>
                                            <Text style={styles.btnTxt}>Add</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </>
                        ) : (
                            <Text>User not found</Text>
                        )}

                        <TouchableOpacity style={styles.doneBtn} onPress={closeModal}>
                            <Text style={styles.btnTxt}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalView: { width: '85%', maxWidth: 420, paddingVertical: 28, paddingHorizontal: 24, borderRadius: 16, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: '700', textAlign: 'center', color: '#222' },
    subtitle: { fontSize: 14, textAlign: 'center', color: '#777' },
    section: { marginTop: 16, fontWeight: '600' },
    requestMsg: { marginTop: 6, color: '#333' },
    status: { marginTop: 8, fontStyle: 'italic', color: '#555' },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 24 },
    actionTxt: { color: '#fff', marginLeft: 6, fontWeight: '700' },
    badgeWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
    badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eef3ff', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, margin: 4 },
    badgeText: { fontSize: 12, color: '#375ce8', marginRight: 4 },
    noneTxt: { fontStyle: 'italic', color: '#888', marginTop: 4 },
    picker: { width: '100%', marginTop: 4 },
    addBtn: { marginTop: 12, alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 24, borderRadius: 24, backgroundColor: '#0a7' },
    doneBtn: { marginTop: 24, width: '100%', paddingVertical: 12, borderRadius: 24, backgroundColor: '#00d084', alignItems: 'center' },
    btnTxt: { color: '#fff', fontWeight: '700' },
});