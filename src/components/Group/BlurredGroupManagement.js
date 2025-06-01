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
  serverTimestamp,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../../firebase.config';

export default function GroupMemberRolesModal() {
  const navigation            = useNavigation();
  const { params }            = useRoute();
  const { userId, groupId }   = params || {};

  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const [user, setUser]           = useState(null);
  const [groupRoles, setGroupRoles] = useState([]);   // [{ hashtag, name }]
  const [userRoles, setUserRoles]   = useState([]);   // ['#admin', ...]
  const [selectedRole, setSelectedRole] = useState('');

  /* fetch user, group roles and user roles */
  useEffect(() => {
    if (!userId || !groupId) return;

    (async () => {
      try {
        const userSnap = await getDoc(doc(db, 'users', String(userId)));
        if (userSnap.exists()) setUser(userSnap.data());

        const rolesSnap = await getDocs(
            collection(db, 'groups', String(groupId), 'roles')
        );
        setGroupRoles(
            rolesSnap.docs.map((d) => ({ hashtag: d.id, name: d.data().name }))
        );

        const userRoleSnap = await getDoc(
            doc(db, 'groups', String(groupId), 'user_roles', String(userId))
        );
        if (userRoleSnap.exists()) {
          const { roles = [] } = [...userRoleSnap.data()];
          setUserRoles(roles);
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, groupId]);

  const saveRoles = async (rolesArr) =>
      setDoc(
          doc(db, 'groups', String(groupId), 'user_roles', String(userId)),
          { roles: rolesArr, updatedAt: serverTimestamp() },
          { merge: true }
      );

  const addRole = async () => {
    if (!selectedRole || userRoles.includes(selectedRole)) return;
    const updated = [...userRoles, selectedRole];
    try {
      await saveRoles(updated);
      setUserRoles(updated);
      setSelectedRole('');
    } catch {
      Alert.alert('Error', 'Could not add role.');
    }
  };

  const removeRole = async (tag) => {
    const updated = userRoles.filter((r) => r !== tag);
    try {
      await saveRoles(updated);
      setUserRoles(updated);
    } catch {
      Alert.alert('Error', 'Could not remove role.');
    }
  };

  const closeModal = () => {
    setVisible(false);
    navigation.goBack();
  };

  if (loading) {
    return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={closeModal}
        >
          <View style={styles.backdrop}>
            <View style={styles.modalView}>
              {user ? (
                  <>
                    <View style={styles.header}>
                      <Text style={styles.title}>{user.name}</Text>
                      <Text style={styles.subtitle}>@{user.hashtag}</Text>
                    </View>

                    <Text style={styles.section}>Current roles</Text>
                    {userRoles.length ? (
                        <View style={styles.badgeWrap}>
                          {userRoles.map((tag,idx) => (
                              <View key={`${tag}-${idx}`} style={styles.badge}>
                                <Text style={styles.badgeText}>{tag}</Text>
                                <TouchableOpacity onPress={() => removeRole(tag)}>
                                  <Ionicons name="close-circle" size={16} color="#888" />
                                </TouchableOpacity>
                              </View>
                          ))}
                        </View>
                    ) : (
                        <Text style={styles.noneTxt}>No active roles</Text>
                    )}

                    <Text style={styles.section}>Add role</Text>
                    <Picker
                        selectedValue={selectedRole}
                        onValueChange={setSelectedRole}
                        style={styles.picker}
                    >
                      <Picker.Item label="Select..." value="" />
                      {groupRoles.map((r,idx) => (
                          <Picker.Item
                              key={`${r}-${idx}`}
                              label={`${r.name} (${r.hashtag})`}
                              value={r.hashtag}
                          />
                      ))}
                    </Picker>
                    <TouchableOpacity style={styles.addBtn} onPress={addRole}>
                      <Text style={styles.btnTxt}>Add</Text>
                    </TouchableOpacity>
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

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    width: '40%',
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },

  header: { alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 20, fontWeight: '700', color: '#222' },
  subtitle: { fontSize: 14, color: '#777' },

  section: { alignSelf: 'flex-start', marginTop: 16, fontWeight: '600' },
  noneTxt: { fontStyle: 'italic', color: '#888', marginTop: 4 },

  badgeWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef3ff',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    margin: 4,
  },
  badgeText: { fontSize: 12, color: '#375ce8', marginRight: 4 },

  picker: { width: '100%', marginTop: 4 },

  addBtn: {
    marginTop: 14,
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#0a7',
  },
  doneBtn: {
    marginTop: 24,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#00d084',
    alignItems: 'center',
  },
  btnTxt: { color: '#fff', fontWeight: '700' },
});
