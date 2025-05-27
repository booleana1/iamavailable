import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Picker } from 'react-native';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { COLORS, FONTS } from '../../styles/theme';
import CalendarComp from './CalendarComp';
import LocationMap from './MeetingMap';
import DoneButton from '../DoneButton';

export default function Forms() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [group, setGroup] = useState('');
  const [link, setLink] = useState('');
  const [periodicity, setPeriodicity] = useState('unique');

  const [date, setDate] = useState(null);
  const [hour, setHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const getRoleIdFromName = async (roleName) => {
    const rolesRef = collection(db, 'roles');
    const querySnapshot = await getDocs(rolesRef);
    let roleId = null;
    querySnapshot.forEach((doc) => {
      if (doc.data().role_name.toLowerCase() === roleName.toLowerCase()) {
        roleId = doc.id;
      }
    });
    return roleId;
  };

  const getGroupIdFromHashtag = async (hashtag) => {
    const groupsRef = collection(db, 'groups');
    const querySnapshot = await getDocs(groupsRef);
    let groupId = null;
    querySnapshot.forEach((doc) => {
      if (doc.data().hashtag.toLowerCase() === hashtag.toLowerCase()) {
        groupId = doc.id;
      }
    });
    return groupId;
  };

  const handleSubmit = async () => {
    if (!name || !role || !group || !date || !hour) {
      alert('Please complete all required fields.');
      return;
    }

    const roleId = await getRoleIdFromName(role);
    if (!roleId) {
      alert('The role name entered is invalid.');
      return;
    }

    const groupId = await getGroupIdFromHashtag(group);
    if (!groupId) {
      alert('The group hashtag entered is invalid.');
      return;
    }

    const userId = 1;
    const startDateTime = new Date(`${date}T${hour}`);
    const endDateTime = new Date(`${date}T${endHour || hour}`);

    if (endDateTime <= startDateTime) {
      alert('End time must be after start time.');
      return;
    }

    const availabilitiesRef = collection(db, 'availabilities');
    const snapshot = await getDocs(availabilitiesRef);

    const conflict = snapshot.docs.some(doc => {
      const data = doc.data();
      if (data.user_id !== userId) return false;
      const existingStart = new Date(data.start_date);
      return existingStart.getTime() === startDateTime.getTime();
    });

    if (conflict) {
      alert('You already have an availability at that date and time.');
      return;
    }

    const availability = {
      name,
      role_id: roleId,
      group_id: groupId,
      location: link || '',
      start_date: startDateTime.toISOString(),
      end_date: endDateTime.toISOString(),
      periodicity,
      is_geolocated: latitude !== null && longitude !== null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      radius: null,
      user_id: userId,
    };

    const cleanString = (str) =>
      str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');

    try {
      const newId = `${cleanString(name)}_${cleanString(group)}_${Date.now()}`;
      await setDoc(doc(db, 'availabilities', newId), availability);
      alert('Availability created successfully!');
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('Failed to save availability');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a new Availability</Text>

      <View style={styles.row}>
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

        <View style={styles.calendar}>
          <CalendarComp
            date={date}
            setDate={setDate}
            hour={hour}
            setHour={setHour}
            endHour={endHour}
            setEndHour={setEndHour}
          />
        </View>

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
