import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import CalendarEditor from './CalendarEditor';
import LocationMapEditor from './LocationMapEditor';
import DoneButton from '../DoneButton';

export default function ManageAvailabilityForm({ initialData, onSuccess }) {
  const [name, setName] = useState(initialData.name || '');
  const [roleId, setRoleId] = useState(String(initialData.role_id || ''));
  const [groupId, setGroupId] = useState(String(initialData.group_id || ''));
  const [location, setLocation] = useState(initialData.location || '');
  const [periodicity, setPeriodicity] = useState(initialData.periodicity || '');

  const [date, setDate] = useState(
    initialData.start_date ? initialData.start_date.split('T')[0] : ''
  );
  const [hour, setHour] = useState(
    initialData.start_date ? initialData.start_date.split('T')[1]?.slice(0, 5) : ''
  );
  const [endHour, setEndHour] = useState(
    initialData.end_date ? initialData.end_date.split('T')[1]?.slice(0, 5) : ''
  );

  const [latitude, setLatitude] = useState(initialData.latitude || 41.79648);
  const [longitude, setLongitude] = useState(initialData.longitude || -6.76942);

  const handleSave = async () => {
    try {
      const start_date = `${date}T${hour}:00`;
      const end_date = `${date}T${endHour}:00`;

      const docRef = doc(db, 'availabilities', initialData.firestore_id);

      await updateDoc(docRef, {
        name,
        role_id: Number(roleId),
        group_id: Number(groupId),
        location,
        periodicity,
        start_date,
        end_date,
        latitude,
        longitude,
      });

      alert('Success', 'Availability updated successfully!');
      if (onSuccess)
        onSuccess({
          ...initialData,
          name,
          role_id: Number(roleId),
          group_id: Number(groupId),
          location,
          periodicity,
          start_date,
          end_date,
          latitude,
          longitude,
        });
    } catch (error) {
      console.error('Error updating availability:', error);
      Alert.alert('Error', 'Failed to update availability.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Formulario */}
      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formInner}>
          <Text style={styles.title}>Edit Availability</Text>

          <TextInput
            placeholder="Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Role ID"
            style={styles.input}
            value={roleId}
            onChangeText={setRoleId}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Group ID"
            style={styles.input}
            value={groupId}
            onChangeText={setGroupId}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Location / link"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            placeholder="Periodicity"
            style={styles.input}
            value={periodicity}
            onChangeText={setPeriodicity}
          />
        </View>
      </ScrollView>

      {/* Botón Done fuera del ScrollView para mover libremente */}
      <DoneButton style={styles.doneButton} onPress={handleSave} />

      {/* Calendario */}
      <View style={styles.calendarContainer}>
        <CalendarEditor
          date={date}
          onDateChange={setDate}
          hour={hour}
          onHourChange={setHour}
          endHour={endHour}
          onEndHourChange={setEndHour}
        />
      </View>

      {/* Mapa */}
      <View style={styles.mapContainer}>
        <LocationMapEditor
          latitude={latitude}
          longitude={longitude}
          onLocationChange={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    flex: 1,
    marginRight: 20,
    paddingRight: 10,
    position: 'relative',
  },
  formContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  formInner: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 320,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
    color: '#111',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  doneButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  calendarContainer: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 100,
  },
  mapContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
});
