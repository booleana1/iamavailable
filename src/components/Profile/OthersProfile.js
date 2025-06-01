import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { COLORS } from '../../styles/theme';

export default function AccountInfo({ userId }) {
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userGroups, setUserGroups] = useState([]);          // grupos onde é membro
  const [userGroupsCreated, setUserGroupsCreated] = useState([]); // grupos que criou
  const [loading, setLoading] = useState(true);

  /* --------------------------- DATA FETCH --------------------------- */
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        /* ---------- User ---------- */
        const userSnap = await getDoc(doc(db, 'users', String(userId)));
        setUser(userSnap.exists() ? userSnap.data() : null);

        /* ---------- Roles ---------- */
        const rolesSnap = await getDocs(
            query(
                collection(db, 'user_has_role'),
                where('user_id', '==', userId),
                where('active', '==', true)
            )
        );
        const roleIds = rolesSnap.docs.map((d) => d.data().role_id);

        let roleNames = [];
        if (roleIds.length) {
          const rolesDataSnap = await getDocs(
              query(collection(db, 'roles'), where('__name__', 'in', roleIds))
          );
          roleNames = rolesDataSnap.docs.map((d) => d.data().role_name);
        }
        setUserRoles(roleNames);

        /* ---------- Groups as member ---------- */
        const groupUsersSnap = await getDocs(
            query(collection(db, 'group_users'), where('user_id', '==', userId))
        );
        const memberGroupIds = groupUsersSnap.docs.map((d) => d.data().group_id);

        let memberGroups = [];
        if (memberGroupIds.length) {
          const groupsRef = collection(db, 'groups');
          const chunkSize = 10; // Firestore “in” limit
          for (let i = 0; i < memberGroupIds.length; i += chunkSize) {
            const chunk = memberGroupIds.slice(i, i + chunkSize);
            const groupsSnap = await getDocs(
                query(groupsRef, where('id', 'in', chunk))
            );
            memberGroups = memberGroups.concat(
                groupsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
            );
          }
        }
        setUserGroups(memberGroups);

        /* ---------- Groups created by user ---------- */
        const groupsCreatedSnap = await getDocs(
            query(collection(db, 'groups'), where('user_id', '==', userId))
        );
        const createdGroups = groupsCreatedSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setUserGroupsCreated(createdGroups);
      } catch (err) {
        console.error('Error loading user info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, [userId]);

  /* --------------------------- RENDER --------------------------- */
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
        <Text style={styles.value}>
          {userRoles.length ? userRoles.join(', ') : 'No roles assigned'}
        </Text>

        <Text style={styles.label}>Groups to which it belongs:</Text>
        {userGroups.length ? (
            userGroups.map((group) => (
                <View key={group.id} style={styles.groupRow}>
                  <Text style={styles.groupTextName}>@{group.hashtag}</Text>
                  <Text style={styles.groupText}>{group.name}</Text>
                </View>
            ))
        ) : (
            <Text style={styles.value}>No groups assigned</Text>
        )}

        <Text style={[styles.label, { marginTop: 20 }]}>
          Groups created by the user:
        </Text>
        {userGroupsCreated.length ? (
            userGroupsCreated.map((group) => (
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

/* --------------------------- STYLES --------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    fontSize: 14,
    color: COLORS.text,
    paddingRight: 25,
  },
  groupTextName: {
    fontSize: 14,
    color: COLORS.text,
  },
});
