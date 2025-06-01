import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
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
import { useUser } from '../../context/UserContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import DoneButton from '../DoneButton';

export default function GroupInfo() {
  const navigation = useNavigation();
  const { loggedUserId } = useUser();           // ← ainda disponível caso precise
  const route = useRoute();
  const { groupId } = route.params;

  const [group, setGroup] = useState(null);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------------------- */
  useEffect(() => {
    const loadGroupInfo = async () => {
      try {
        /* ---------- GRUPO ---------- */
        const groupSnap = await getDoc(doc(db, 'groups', groupId));
        if (!groupSnap.exists()) {
          setLoading(false);
          return;
        }
        setGroup(groupSnap.data());

        /* ---------- USERS ---------- */
        const strGroupId = String(groupId);

        // 1. Pega todos os users aprovados no grupo
        const approvedQuery = query(
            collection(db, 'group_users'),
            where('group_id', '==', strGroupId),
            where('status', '==', 'approved')
        );
        const approvedSnap = await getDocs(approvedQuery);
        const approvedUserIds = approvedSnap.docs.map((d) => d.data().user_id);

        // 2. Resolve nomes de usuários
        const namesDict = await fetchUserNames(approvedUserIds);

        // 3. Monta a mesma estrutura usada em GroupManagement
        const approvedData = approvedSnap.docs.map((d) => {
          const data = d.data();
          return { id: d.id, ...data, name: namesDict[data.user_id] };
        });

        setApprovedUsers(approvedData);
      } catch (err) {
        console.error('Error loading group info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGroupInfo();
  }, [groupId]);

  /* -------------------------------- HELPERS --------------------------- */
  const fetchUserNames = async (userIds) => {
    const dict = {};
    for (const uid of userIds) {
      const snap = await getDoc(doc(db, 'users', String(uid)));
      if (snap.exists()) dict[uid] = snap.data().name;
    }
    return dict;
  };

  /* -------------------------------- RENDER ---------------------------- */
  const renderUserItem = ({ item }) => (
      <View style={styles.userItem}>
        <Text style={styles.userName}>{item.name}</Text>
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
        <View style={styles.mainContent}>
          <View style={styles.topRow}>
            <Text style={styles.title}>GROUP DETAILS</Text>

            {/* -------- USERS TABELA -------- */}
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

          {/* -------- DADOS DO GRUPO -------- */}
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
          </View>
        </View>

        <DoneButton
            style={{ position: 'absolute', bottom: 40, right: 40 }}
            onPress={() => navigation.goBack()}
        />
      </View>
  );
}

/* ------------------------------- STYLES ------------------------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  /* ------- USERS ------- */
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
});
