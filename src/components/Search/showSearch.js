import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import initialData from '../../data/initial_data';

const Datalist = () => {
  const getUserById = (id) => initialData.users[id];

  const [searchText, setSearchText] = useState('');

  const groupUsersArray = Object.values(initialData.group_users);
  const usersArray = Object.values(initialData.users);
  const groupsArray = Object.values(initialData.groups).filter(group => group.is_public);
  const availabilitiesArray = Object.values(initialData.availabilities);

  const filterBySearch = (items, key = 'name') =>
    items.filter(item =>
      item[key].toLowerCase().includes(searchText.toLowerCase())
    );

  const countApprovedUsers = (groupId) =>
    groupUsersArray.filter(
      (gu) => gu.group_id === groupId && gu.status === 'approved'
    ).length;

  // NUEVO: Filtrado de grupos por nombre
  const filteredGroupsArray = filterBySearch(groupsArray, 'name');

  // NUEVO: Filtrado de availabilities por nombre de usuario
  const filteredAvailabilitiesArray = availabilitiesArray.filter(availability => {
    const user = getUserById(availability.user_id);
    return user && user.name.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        placeholderTextColor="#999"
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />

      <ScrollView style={styles.scrollArea}>
        {/* Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Groups</Text>
          {filteredGroupsArray.map(group => {
            const approvedCount = countApprovedUsers(group.id);
            return (
              <View key={group.id} style={styles.item}>
                <View>
                  <Text style={styles.itemText}>{group.name}</Text>
                  <Text style={styles.itemCount}>
                    Approved Members: {approvedCount}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Availabilities */}
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

        {/* Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Users</Text>
          {filterBySearch(usersArray).map(user => (
            <View key={user.id} style={styles.item}>
              <Text style={styles.itemText}>{user.name}</Text>
              <Text style={styles.itemCount}>ID {user.id}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 20,
    height: 500,
    width: '30%',
    position: 'absolute',
    left: '18%',
    top: '22.5%',
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
