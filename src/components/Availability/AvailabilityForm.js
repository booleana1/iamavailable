import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Picker } from 'react-native';  // Asegúrate de importar Picker
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { COLORS, FONTS } from '../../styles/theme';
import CalendarComp from './CalendarComp';
import LocationMap from './MeetingMap';
import DoneButton from '../DoneButton';

export default function Forms() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');  // Role name, not id
  const [group, setGroup] = useState(''); // Group hashtag, not group_id
  const [link, setLink] = useState('');
  const [periodicity, setPeriodicity] = useState('unique'); // Default periodicity

  const [date, setDate] = useState(null);
  const [hour, setHour] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Function to get roleId from role name
  const getRoleIdFromName = async (roleName) => {
    const rolesRef = collection(db, 'roles');
    const querySnapshot = await getDocs(rolesRef);
    let roleId = null;

    querySnapshot.forEach((doc) => {
      if (doc.data().role_name.toLowerCase() === roleName.toLowerCase()) {
        roleId = doc.id; // Assuming the document ID is the role_id
      }
    });

    return roleId;
  };

  // Function to get groupId from hashtag
  const getGroupIdFromHashtag = async (hashtag) => {
    const groupsRef = collection(db, 'groups');
    const querySnapshot = await getDocs(groupsRef);
    let groupId = null;

    querySnapshot.forEach((doc) => {
      if (doc.data().hashtag.toLowerCase() === hashtag.toLowerCase()) {
        groupId = doc.id; // Assuming the document ID is the group_id
      }
    });

    return groupId;
  };
  

  const handleSubmit = async () => {
    if (!name || !role || !group || !date || !hour) {
      Alert.alert('Missing fields', 'Please complete all required fields.');
      return;
    }

    // Get the role_id from the role name
    const roleId = await getRoleIdFromName(role);
    if (!roleId) {
      Alert.alert('Invalid Role', 'The role name entered is invalid.');
      return;
    }

    // Get the group_id from the group hashtag
    const groupId = await getGroupIdFromHashtag(group);
    if (!groupId) {
      Alert.alert('Invalid Group', 'The group hashtag entered is invalid.');
      return;
    }

    const availability = {
      name,
      role_id: roleId, // Use role_id instead of role
      group_id: groupId, // Use group_id instead of group
      location: link || '',
      start_date: `${date}T${hour}`,
      end_date: `${date}T${hour}`,
      periodicity,  // Add the selected periodicity
      is_geolocated: latitude !== null && longitude !== null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      radius: null,
      user_id: 1,
    };

    const cleanString = (str) =>
    str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');

    try {
      const newId = `${cleanString(name)}_${cleanString(group)}_${Date.now()}`;
      await setDoc(doc(db, 'availabilities', newId), availability);
      Alert.alert('Success', 'Availability created successfully!');
    } catch (error) {
      console.error('Error saving availability:', error);
      Alert.alert('Error', 'Failed to save availability');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new Availability</Text>

      <View style={styles.row}>
        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Role</Text>
            <TextInput value={role} onChangeText={setRole} placeholder="Role Name" style={styles.input} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Group Hashtag</Text>
            <TextInput value={group} onChangeText={setGroup} placeholder="Group Hashtag" style={styles.input} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Link (if online)</Text>
            <TextInput value={link} onChangeText={setLink} placeholder="Optional link" style={styles.input} />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Select Periodicity</Text>
            <Picker
              selectedValue={periodicity}
              onValueChange={(itemValue) => setPeriodicity(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Unique" value="unique" />
              <Picker.Item label="Weekly" value="weekly" />
              <Picker.Item label="Monthly" value="monthly" />
            </Picker>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendar}>
          <CalendarComp date={date} setDate={setDate} hour={hour} setHour={setHour} />
        </View>

        {/* Map */}
        <View style={styles.map}>
          <LocationMap onLatitudeChange={setLatitude} onLongitudeChange={setLongitude} />
        </View>
      </View>

      <DoneButton style={styles.doneButton} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    gap: 30,
  },
  form: {
    flex: 1,
    padding: 10,
  },
  calendar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    marginBottom: 6,
  },
  input: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    fontFamily: FONTS.regular,
  },
  doneButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    width: 120,
  },
  picker: {
    height: 40,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
});
