import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Button,
  Alert,
  FlatList,
} from 'react-native';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { useUser } from '../../context/UserContext';
import DoneButton from '../DoneButton';
import { useNavigation } from '@react-navigation/native';

export default function GroupDontBelong({ route }) {
  const navigation = useNavigation();
  const { loggedUserId } = useUser();
  const { groupId } = route.params;

  const [group, setGroup] = useState(null);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [requestMessage, setRequestMessage] = useState('');
  const [loading, setLoading] = useState(true);

  /* ------------------------ DATA FETCH ------------------------ */
  useEffect(() => {
    const loadGroupInfo = async () => {
      try {
        /* 1. Grupo ------------------------------------------------ */
        const groupRef = doc(db, 'groups', String(groupId));
        const groupSnap = await getDoc(groupRef);
        if (!groupSnap.exists()) {
          Alert.alert('Error', 'Group not found');
          return;
        }
        setGroup({ id: groupSnap.id, ...groupSnap.data() });

        /* 2. Usuários aprovados ---------------------------------- */
        const approvedSnap = await getDocs(
            query(
                collection(db, 'group_users'),
                where('group_id', '==', String(groupId)),
                where('status', '==', 'approved')
            )
        );

        const approvedUserIds = approvedSnap.docs.map((d) => d.data().user_id);
        const namesDict = await fetchUserNames(approvedUserIds);

        const approvedData = approvedSnap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,               // id do doc em group_users
            user_id: data.user_id,  // referência ao usuário
            name: namesDict[data.user_id] ?? 'Unknown',
          };
        });

        setApprovedUsers(approvedData);
      } catch (err) {
        console.error('Error loading group info:', err);
        Alert.alert('Error', 'Failed to load group information');
      } finally {
        setLoading(false);
      }
    };

    loadGroupInfo();
  }, [groupId, loggedUserId]);

  /* -------- Resolve nomes (igual aos outros componentes) ------ */
  const fetchUserNames = async (userIds = []) => {
    const names = {};
    for (const uid of userIds) {
      const snap = await getDoc(doc(db, 'users', String(uid)));
      if (snap.exists()) names[uid] = snap.data().name;
    }
    return names;
  };

  /* ---------------------- REQUEST JOIN ------------------------ */
  const sendRequest = async () => {
    if (!requestMessage.trim()) {
      Alert.alert('Validation', 'Please enter a request message.');
      return;
    }

    try {
      await addDoc(collection(db, 'group_users'), {
        created_at: new Date().toISOString(),
        group_id: String(groupId),
        user_id: loggedUserId,
        status: 'pending',
        request_message: requestMessage.trim(),
      });
      Alert.alert('Success', 'Request sent successfully.');
      setRequestMessage('');
    } catch (err) {
      console.error('Error sending request:', err);
      Alert.alert('Error', 'Failed to send request.');
    }
  };

  /* ------------------------- UI ------------------------------- */
  const renderUserItem = ({ item }) => (
      <View style={styles.userItem}>
        <Text style={styles.userName}>{item.name}</Text>
      </View>
  );

  if (loading) {
    return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#07EE8A" />
        </View>
    );
  }

  if (!group) {
    return (
        <View style={styles.centered}>
          <Text>Group not found</Text>
        </View>
    );
  }

  return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.mainContent}>
            {/* ---------- Header + Users ---------- */}
            <View style={styles.topRow}>
              <Text style={styles.title}>GROUP DETAILS</Text>

              <View style={styles.usersTable}>
                <Text style={styles.tableTitle}>Users</Text>
                {approvedUsers.length === 0 ? (
                    <Text style={styles.noDataText}>No approved users</Text>
                ) : (
                    <FlatList
                        data={approvedUsers}
                        keyExtractor={(item) => item.id}
                        renderItem={renderUserItem}
                    />
                )}
              </View>
            </View>

            {/* ---------- Group Details ---------- */}
            <View style={styles.detailsContainer}>
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Name</Text>
                  <Text style={styles.text}>{group.name}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Hashtag</Text>
                  <Text style={styles.text}>#{group.hashtag}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.rowItemFull}>
                  <Text style={styles.label}>Description</Text>
                  <Text style={styles.text}>
                    {group.description || 'No description available'}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Type</Text>
                  <Text style={styles.text}>
                    {group.is_public ? 'Public' : 'Private'}
                  </Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Admission</Text>
                  <Text style={styles.text}>
                    {group.auto_admission ? 'Auto-Admission' : 'Manual-Admission'}
                  </Text>
                </View>
              </View>

              {/* ---------- Join Request ---------- */}
              <View style={styles.requestContainer}>
                <Text style={styles.label}>Request Message</Text>
                <TextInput
                    style={styles.requestInput}
                    value={requestMessage}
                    onChangeText={setRequestMessage}
                    placeholder="Request Message"
                />
                <Button
                    title="Request Join"
                    onPress={sendRequest}
                    color="#07EE8A"
                />
              </View>
            </View>
          </View>
        </View>

        <DoneButton
            style={{ position: 'absolute', bottom: 40, right: 40 }}
            onPress={() => navigation.goBack()}
        />
      </View>
  );
}

/* ------------------------- STYLES ------------------------- */
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
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
  text: {
    fontSize: 14,
    color: '#333',
  },
  /* ----- USERS ----- */
  usersTable: {
    width: '25%',
    marginLeft: 30,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    paddingVertical: 5,
  },
  userName: {
    fontSize: 16,
    color: '#333',
  },
  noDataText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  /* ----- REQUEST ----- */
  requestContainer: {
    marginTop: 20,
    width: '30%',
    alignSelf: 'flex-end',
  },
  requestInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 13,
    backgroundColor: '#f9f9f9',
    height: 35,
  },
});
