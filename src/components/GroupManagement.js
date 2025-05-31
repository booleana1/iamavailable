import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Switch, FlatList } from 'react-native';
import Sidebar from './GroupSidebar';
import { db } from '../../firebase.config';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';

export default function GroupManagement({ loggedUserId, navigation }) {
  const [name, setName] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [autoAdmission, setAutoAdmission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [myGroups, setMyGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    const loadGroups = async () => {
      const myGroupsQuery = query(collection(db, 'groups'), where('user_id', '==', loggedUserId));
      const myGroupsSnap = await getDocs(myGroupsQuery);
      const myGroupsData = myGroupsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyGroups(myGroupsData);

      const groupUsersQuery = query(collection(db, 'group_users'), where('user_id', '==', loggedUserId), where('status', '==', 'approved'));
      const groupUsersSnap = await getDocs(groupUsersQuery);
      const groupIds = groupUsersSnap.docs.map(doc => doc.data().group_id);

      let otherGroupsData = [];
      if (groupIds.length > 0) {
        const groupsDataQuery = query(collection(db, 'groups'), where('id', 'in', groupIds));
        const groupsDataSnap = await getDocs(groupsDataQuery);
        otherGroupsData = groupsDataSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      setOtherGroups(otherGroupsData);

      if (myGroupsData.length > 0) {
        const group = myGroupsData[0];
        setSelectedGroupId(group.id);
        setName(group.name);
        setHashtag(group.hashtag);
        setDescription(group.description);
        setIsPublic(group.is_public);
        setAutoAdmission(group.auto_admission);
        loadUsers(group.id);
      }
    };

    const loadUsers = async (groupId) => {
      const approvedQuery = query(collection(db, 'group_users'), where('group_id', '==', groupId), where('status', '==', 'approved'));
      const approvedSnap = await getDocs(approvedQuery);
      const approvedUserIds = approvedSnap.docs.map(doc => doc.data().user_id);

      const pendingQuery = query(collection(db, 'group_users'), where('group_id', '==', groupId), where('status', '==', 'pending'));
      const pendingSnap = await getDocs(pendingQuery);
      const pendingUserIds = pendingSnap.docs.map(doc => doc.data().user_id);

      const userNames = await fetchUserNames([...approvedUserIds, ...pendingUserIds]);

      const approvedUsersData = approvedSnap.docs.map(doc => {
        const userData = doc.data();
        return { id: doc.id, ...userData, name: userNames[userData.user_id] };
      });

      const pendingUsersData = pendingSnap.docs.map(doc => {
        const userData = doc.data();
        return { id: doc.id, ...userData, name: userNames[userData.user_id] };
      });

      setApprovedUsers(approvedUsersData);
      setPendingUsers(pendingUsersData);
    };

    const fetchUserNames = async (userIds) => {
      const userNames = {};
      for (const userId of userIds) {
        const userQuery = query(collection(db, 'users'), where('id', '==', userId));
        const userSnap = await getDocs(userQuery);
        if (!userSnap.empty) {
          userSnap.forEach(doc => {
            userNames[userId] = doc.data().name;
          });
        }
      }
      return userNames;
    };

    loadGroups();
  }, [loggedUserId]);

  const handleSubmit = async () => {
    if (!selectedGroupId) {
      console.error('No group selected');
      return;
    }

    setLoading(true);
    try {
      const groupRef = doc(db, 'groups', selectedGroupId);
      await updateDoc(groupRef, {
        name: name,
        hashtag: hashtag,
        description: description,
        is_public: isPublic,
        auto_admission: autoAdmission,
      });
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
      <Sidebar myGroups={myGroups} otherGroups={otherGroups} />

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

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Public/Private</Text>
                <View style={styles.switchContainer}>
                  <Text>Private</Text>
                  <Switch value={isPublic} onValueChange={setIsPublic} />
                  <Text>Public</Text>
                </View>
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Self-admission</Text>
                <View style={styles.switchContainer}>
                  <Text>No</Text>
                  <Switch value={autoAdmission} onValueChange={setAutoAdmission} />
                  <Text>Yes</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.doneButton} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.doneButtonText}>Save Changes</Text>}
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
                  renderItem={({ item }) => (
                    <View style={styles.userItem}>
                      <Text style={styles.userText}>{item.name}</Text>
                      <TouchableOpacity style={styles.plusButton} onPress={() => navigation.navigate('UserRoleManagement', { userId: item.user_id, loggedUserId })}>
                        <Text style={styles.plusSign}>+</Text>
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
                  renderItem={({ item }) => (
                    <View style={styles.userItem}>
                      <Text style={styles.userText}>{item.name}</Text>
                      <TouchableOpacity style={styles.plusButton} onPress={() => navigation.navigate('UserRoleManagement', { userId: item.user_id, loggedUserId })}>
                        <Text style={styles.plusSign}>+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )}
            </View>
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
    shadowOffset: { width: 0, height: 2 },
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
});
