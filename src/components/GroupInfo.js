import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Sidebar from './GroupSidebar';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { COLORS } from '../styles/theme';

export default function GroupInfo({ route, loggedUserId }) {
  const { groupId } = route.params;
  const [group, setGroup] = useState(null);
  const [groupUsers, setGroupUsers] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroupInfo = async () => {
      try {
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

        const groupDoc = await getDoc(doc(db, 'groups', groupId));
        if (groupDoc.exists) {
          setGroup(groupDoc.data());

          const usersRef = collection(db, 'group_users');
          const usersQuery = query(usersRef, where('group_id', '==', groupId), where('status', '==', 'approved'));
          const usersSnap = await getDocs(usersQuery);
          const userIds = usersSnap.docs.map(doc => doc.data().user_id);

          let userNames = [];
          if (userIds.length > 0) {
            const usersDataQuery = query(collection(db, 'users'), where('id', 'in', userIds));
            const usersDataSnap = await getDocs(usersDataQuery);
            userNames = usersDataSnap.docs.map(doc => ({ name: doc.data().name }));
          }
          setGroupUsers(userNames);
        } else {
          console.log('No such group!');
        }
      } catch (err) {
        console.error('Error loading group info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGroupInfo();
  }, [loggedUserId, groupId]);

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
        <ActivityIndicator size="large" color={COLORS.primary} />
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
});
