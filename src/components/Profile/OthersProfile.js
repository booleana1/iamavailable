import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { COLORS } from '../../styles/theme';

export default function AccountInfo({ loggedUserId }) {
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userGroups, setUserGroups] = useState([]);          // grupos donde es miembro
  const [userGroupsCreated, setUserGroupsCreated] = useState([]);  // grupos creados
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        // Get user info
        const userSnap = await getDoc(doc(db, 'users', String(loggedUserId)));
        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          setUser(null);
        }

        // Get roles
        const rolesRef = collection(db, 'user_has_role');
        const rolesQuery = query(rolesRef, where('user_id', '==', loggedUserId), where('active', '==', true));
        const rolesSnap = await getDocs(rolesQuery);
        const roleIds = rolesSnap.docs.map(doc => doc.data().role_id);

        let roleNames = [];
        if (roleIds.length > 0) {
          const rolesDataQuery = query(collection(db, 'roles'), where('__name__', 'in', roleIds));
          const rolesDataSnap = await getDocs(rolesDataQuery);
          roleNames = rolesDataSnap.docs.map(doc => doc.data().role_name);
        }

        setUserRoles(roleNames);

        // Get group memberships from group_users
        const groupUsersRef = collection(db, 'group_users');
        const groupUsersQuery = query(groupUsersRef, where('user_id', '==', loggedUserId));
        const groupUsersSnap = await getDocs(groupUsersQuery);
        const memberGroupIds = groupUsersSnap.docs.map(doc => doc.data().group_id);

        let memberGroups = [];
        if (memberGroupIds.length > 0) {
          const groupsRef = collection(db, 'groups');
          // Firestore limit: max 10 in a 'where in' clause
          const chunkSize = 10;
          for (let i = 0; i < memberGroupIds.length; i += chunkSize) {
            const chunk = memberGroupIds.slice(i, i + chunkSize);
            // QUERY con campo 'id' y no __name__
            const groupsQuery = query(groupsRef, where('id', 'in', chunk));
            const groupsSnap = await getDocs(groupsQuery);
            memberGroups = memberGroups.concat(groupsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }
        }
        setUserGroups(memberGroups);

        // Get groups created by user (where user_id == loggedUserId)
        const groupsCreatedQuery = query(collection(db, 'groups'), where('user_id', '==', loggedUserId));
        const groupsCreatedSnap = await getDocs(groupsCreatedQuery);
        const createdGroups = groupsCreatedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserGroupsCreated(createdGroups);

      } catch (err) {
        console.error('Error loading user info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [loggedUserId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.value}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>

      <Image source={{ uri: user.photo_url }} style={styles.pfp} />

      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>@{user.hashtag}</Text>

      <Text style={styles.label}>Complete Name:</Text>
      <Text style={styles.value}>{user.name}</Text>

      <Text style={styles.label}>Roles:</Text>
      <Text style={styles.value}>{userRoles.length ? userRoles.join(', ') : 'No roles assigned'}</Text>

      <Text style={styles.label}>Groups to which it belongs:</Text>
      {userGroups.length ? (
        userGroups.map(group => (
          <View key={group.id} style={styles.groupRow}>
            <Text style={styles.groupTextName}>@{group.hashtag}</Text>
            <Text style={styles.groupText}>{group.name}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.value}>No groups assigned</Text>
      )}

      <Text style={[styles.label, { marginTop: 20 }]}>Groups created by the user:</Text>
      {userGroupsCreated.length ? (
        userGroupsCreated.map(group => (
          <View key={group.id} style={styles.groupRow}>
            <Text style={styles.groupTextName}>@{group.hashtag}</Text>
            <Text style={styles.groupText}>{group.name}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.value}>No groups created</Text>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingLeft: '17.5%',
    paddingRight: '50%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingTop: '10%',
    color: COLORS.primary,
  },
  pfp: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    color: COLORS.text,
  },
  value: {
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.text,
  },
  groupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  groupText: {
    margin: 0,
    paddingRight: 25,
    fontSize: 14,
    color: COLORS.text,
  },
  groupTextName: {
    fontSize: 14,
    color: COLORS.text,
  },
});
