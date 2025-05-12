import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.config';

const Datalist = () => {
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState('All');
  const [minMembers, setMinMembers] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [autoAdmissionOnly, setAutoAdmissionOnly] = useState(false);
  const [availabilityType, setAvailabilityType] = useState('All');
  const [availabilityDateFilter, setAvailabilityDateFilter] = useState('All');

  const [groupUsers, setGroupUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const groupUsersSnap = await getDocs(collection(db, 'group_users'));
      const usersSnap = await getDocs(collection(db, 'users'));
      const groupsSnap = await getDocs(collection(db, 'groups'));
      const availabilitiesSnap = await getDocs(collection(db, 'availabilities'));
      const rolesSnap = await getDocs(collection(db, 'roles'));
      const userRolesSnap = await getDocs(collection(db, 'user_has_role'));

      setGroupUsers(groupUsersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setGroups(groupsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setAvailabilities(availabilitiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setRoles(rolesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setUserRoles(userRolesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  const getUserById = (id) => users.find(u => u.id == id);

  const filterBySearch = (items, key = 'name') =>
    items.filter(item =>
      item[key]?.toLowerCase().includes(searchText.toLowerCase())
    );

  const countApprovedUsers = (groupId) =>
    groupUsers.filter(
      (gu) => gu.group_id === groupId && gu.status === 'approved'
    ).length;

  const getFilteredUsers = () => {
    if (selectedRoleName === 'All') return filterBySearch(users);

    const selectedRoleObj = roles.find(r => r.role_name === selectedRoleName);
    if (!selectedRoleObj) return [];

    const selectedRoleId = selectedRoleObj.id;

    const matchingUserIds = userRoles
      .filter(ur => ur.role_id == selectedRoleId && ur.active)
      .map(ur => ur.user_id?.toString());

    return filterBySearch(users.filter(u => matchingUserIds.includes(u.id?.toString())));
  };

  const getFilteredGroups = () => {
    let filteredGroups = groups.filter(g => g.is_public);

    const min = minMembers ? parseInt(minMembers) : 0;
    const max = maxMembers ? parseInt(maxMembers) : Number.MAX_SAFE_INTEGER;

    filteredGroups = filteredGroups.filter(group => {
      const approvedCount = countApprovedUsers(group.id);
      return approvedCount >= min && approvedCount <= max;
    });

    if (autoAdmissionOnly) {
      filteredGroups = filteredGroups.filter(group => group.auto_admission === true);
    }

    return filteredGroups;
  };

  const isSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const isSameWeek = (date1, date2) => {
    const startOfWeek = new Date(date2);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return date1 >= startOfWeek && date1 <= endOfWeek;
  };

  const isSameMonth = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth();

  const filteredGroupsArray = getFilteredGroups();

  const filteredAvailabilitiesArray = availabilities.filter(availability => {
    const user = getUserById(availability.user_id);
    if (!user || !user.name.toLowerCase().includes(searchText.toLowerCase())) return false;

    const date = new Date(availability.start_date);
    const now = new Date();

    if (availabilityType === 'Online' && availability.is_geolocated) return false;
    if (availabilityType === 'Presential' && !availability.is_geolocated) return false;

    if (availabilityDateFilter === 'Today' && !isSameDay(date, now)) return false;
    if (availabilityDateFilter === 'ThisWeek' && !isSameWeek(date, now)) return false;
    if (availabilityDateFilter === 'ThisMonth' && !isSameMonth(date, now)) return false;

    return true;
  });

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />

        <ScrollView style={styles.scrollArea}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Groups</Text>
            {filteredGroupsArray.map(group => {
              const approvedCount = countApprovedUsers(group.id);
              return (
                <View key={group.id} style={styles.item}>
                  <View>
                    <Text style={styles.itemText}>{group.name}</Text>
                    <Text style={styles.itemCount}>Approved Members: {approvedCount}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availabilities</Text>
            {filteredAvailabilitiesArray.map(availability => {
              const user = getUserById(availability.user_id);
              const username = user ? user.name : `User ${availability.user_id}`;
              const date = new Date(availability.start_date);
              const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${
                (date.getMonth() + 1).toString().padStart(2, '0')
              }/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date
                .getMinutes()
                .toString()
                .padStart(2, '0')}`;

              return (
                <View key={availability.id} style={styles.item}>
                  <Text style={styles.itemText}>{username}</Text>
                  <Text style={styles.itemCount}>{formattedDate}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Users</Text>
            {getFilteredUsers().map(user => (
              <View key={user.id} style={styles.item}>
                <Text style={styles.itemText}>{user.name}</Text>
                <Text style={styles.itemCount}>ID {user.id}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.filterButtonContainer}>
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.iconButton}>
          <Ionicons name="filter" size={36} color="#000" />
        </TouchableOpacity>
        {showFilters && (
          <View style={styles.filterDropdown}>
            <Text style={styles.filterLabel}>USERS</Text>
            <Text style={styles.filterLabel}>Role</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedRoleName}
                onValueChange={(itemValue) => setSelectedRoleName(itemValue)}
              >
                <Picker.Item label="All" value="All" />
                {roles.map(role => (
                  <Picker.Item key={role.id} label={role.role_name} value={role.role_name} />
                ))}
              </Picker>
            </View>

            <Text style={styles.filterLabel}>GROUPS</Text>
            <Text style={styles.filterLabel}>Members</Text>
            <View style={styles.memberRangeContainer}>
              <TextInput
                style={styles.memberInput}
                value={minMembers}
                onChangeText={setMinMembers}
                keyboardType="numeric"
                placeholder="From"
              />
              <TextInput
                style={styles.memberInput}
                value={maxMembers}
                onChangeText={setMaxMembers}
                keyboardType="numeric"
                placeholder="To"
              />
            </View>

            <View style={styles.autoAdmissionContainer}>
              <Text style={styles.filterLabel}>Auto Admission</Text>
              <Switch
                value={autoAdmissionOnly}
                onValueChange={setAutoAdmissionOnly}
              />
            </View>

            <Text style={styles.filterLabel}>AVAILABILITIES</Text>
            <Text style={styles.filterLabel}>Type</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={availabilityType}
                onValueChange={(val) => setAvailabilityType(val)}
              >
                <Picker.Item label="All" value="All" />
                <Picker.Item label="Online" value="Online" />
                <Picker.Item label="Presential" value="Presential" />
              </Picker>
            </View>

            <Text style={styles.filterLabel}>Date</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={availabilityDateFilter}
                onValueChange={(val) => setAvailabilityDateFilter(val)}
              >
                <Picker.Item label="All" value="All" />
                <Picker.Item label="Today" value="Today" />
                <Picker.Item label="This Week" value="ThisWeek" />
                <Picker.Item label="This Month" value="ThisMonth" />
              </Picker>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: '22.5%',
    left: '18%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  container: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 20,
    height: 500,
    width: 400,
  },
  filterButtonContainer: {
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  iconButton: {
    padding: 8,
  },
  filterDropdown: {
    marginTop: 6,
    backgroundColor: '#d3d3d3',
    borderRadius: 6,
    padding: 10,
    elevation: 3,
    width: 250,
    marginLeft: 20,
  },
  filterLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 6,
  },
  memberRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  memberInput: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 90,
  },
  autoAdmissionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  pickerWrapper: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  scrollArea: {
    maxHeight: '90%',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  item: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemText: {
    color: '#000',
  },
  itemCount: {
    color: '#666',
  },
});

export default Datalist;
