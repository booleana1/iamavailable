import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Forms from '../components/Availability/AvailabilityForm';
import CalendarComp from '../components/Availability/CalendarComp';
import SelectLocationMap from '../components/Availability/MeetingMap';
import DoneButton from '../components/DoneButton';
import initialData from '../data/initial_data'; 
import {COLORS} from '../styles/theme';
import { writeFile } from 'react-native-fs'; 

const MainComponent = () => {
  const formRef = useRef(null);
  const calendarRef = useRef(null);
  const mapRef = useRef(null);

  const [nextId, setNextId] = useState(Object.keys(initialData.availabilities).length + 1);

  const handleSubmit = async () => {
    const formData = formRef.current.getFormData();
    const calendarData = calendarRef.current.getCalendarData();
    const mapData = mapRef.current.getMapData();

    if (!formData.name || !formData.role || !formData.group || !calendarData.start_date) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newAvailability = {
      id: nextId,
      user_id: getUserId(formData.name),
      role_id: getRoleId(formData.role),
      group_id: getGroupId(formData.group),
      ...formData,
      ...calendarData,
      ...mapData,
    };

    // Actualizar initialData con la nueva disponibilidad
    initialData.availabilities[nextId] = newAvailability;

    // Convertir initialData a JSON
    const jsonData = JSON.stringify(initialData, null, 2);

    // Guardar el JSON actualizado en el archivo
    try {
      const path = `${RNFS.DocumentDirectoryPath}/archivos.json`;
      await RNFS.writeFile(path, jsonData, 'utf8');
      Alert.alert('Success', 'Data has been saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
      console.error(error);
    }

    // Incrementar el ID para la próxima disponibilidad
    setNextId(nextId + 1);

    // Limpiar los formularios después de enviar
    formRef.current.clearForm();
    calendarRef.current.clearCalendar();
    mapRef.current.clearMap();
  };

  const getUserId = (userName) => {
    for (const userId in initialData.users) {
      if (initialData.users[userId].name === userName) {
        return parseInt(userId);
      }
    }
    return null;
  };

  const getRoleId = (roleName) => {
    for (const roleId in initialData.roles) {
      if (initialData.roles[roleId].role_name === roleName) {
        return parseInt(roleId);
      }
    }
    return null;
  };

  const getGroupId = (groupName) => {
    for (const groupId in initialData.groups) {
      if (initialData.groups[groupId].name === groupName) {
        return parseInt(groupId);
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Forms ref={formRef} />
      <CalendarComp ref={calendarRef} />
      <SelectLocationMap ref={mapRef} />
      <DoneButton style={styles.doneButton} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  doneButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default MainComponent;