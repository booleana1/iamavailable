import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button, Alert } from 'react-native';
import Sidebar from './GroupSidebar';
import { db } from '../../firebase.config';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

export default function GroupDontBelong({ loggedUserId }) {
  const [group, setGroup] = useState(null);
  const [groupUsers, setGroupUsers] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);
  const [requestMessage, setRequestMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroupInfo = async () => {
      try {
        const allGroupsSnap = await getDocs(collection(db, 'groups'));
        const allGroupsData = allGroupsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const groupUsersSnap = await getDocs(query(collection(db, 'group_users'), where('user_id', '==', loggedUserId)));
        const joinedGroupIds = groupUsersSnap.docs.map(doc => doc.data().group_id);

        const otherGroupsData = allGroupsData.filter(group => !joinedGroupIds.includes(group.id));
        const myGroupsData = allGroupsData.filter(group => group.user_id === loggedUserId);

        setMyGroups(myGroupsData);
        setOtherGroups(otherGroupsData);

        if (otherGroupsData.length > 0) {
          const selectedGroup = otherGroupsData[0];
          setGroup(selectedGroup);

          const approvedUsersSnap = await getDocs(query(
            collection(db, 'group_users'),
            where('group_id', '==', selectedGroup.id),
            where('status', '==', 'approved')
          ));
          const userIds = approvedUsersSnap.docs.map(doc => doc.data().user_id);

          let userNames = [];
          if (userIds.length > 0) {
            const usersSnap = await getDocs(query(collection(db, 'users'), where('id', 'in', userIds)));
            userNames = usersSnap.docs.map(doc => ({ name: doc.data().name }));
          }

          setGroupUsers(userNames);
        }
      } catch (err) {
        console.error('Error loading group info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGroupInfo();
  }, [loggedUserId]);

  const sendRequest = async () => {
    if (!requestMessage.trim()) {
      Alert.alert('Validation', 'Please enter a request message.');
      return;
    }

    try {
      await addDoc(collection(db, 'group_users'), {
        created_at: new Date().toISOString(),
        group_id: group.id,
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

  const renderUsersTable = () => (
    <View style={styles.usersTable}>
      <Text style={styles.tableTitle}>Users</Text>
      {groupUsers.map((user, index) => (
        <View key={index} style={styles.userItem}>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#07EE8A" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.container}>
        <Text style={styles.value}>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar myGroups={myGroups} otherGroups={otherGroups} />

      <View style={styles.mainContent}>
        <View style={styles.topRow}>
          <Text style={styles.title}>GROUP DETAILS</Text>
          {renderUsersTable()}
        </View>

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
              <Text style={styles.text}>{group.is_public ? 'Public' : 'Private'}</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Admission</Text>
              <Text style={styles.text}>{group.auto_admission ? 'Auto-Admission' : 'Manual-Admission'}</Text>
            </View>
          </View>

          <View style={styles.requestContainer}>
            <Text style={styles.label}>Request Message</Text>
            <TextInput
              style={styles.requestInput}
              value={requestMessage}
              onChangeText={setRequestMessage}
              placeholder="Request Message"
            />
            <Button title="Request Join" onPress={sendRequest} color="#07EE8A" />
          </View>
        </View>
      </View>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsContainer: {
    marginTop: 20,
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
  text: {
    fontSize: 14,
    color: '#333',
  },
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
