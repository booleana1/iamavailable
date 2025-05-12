import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { COLORS, FONTS } from '../../styles/theme';

export default function AvailabilityDetails({ availabilityId }) {
  const [availability, setAvailability] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const availabilityDoc = await getDoc(doc(db, 'availabilities', availabilityId));
        const availabilityData = availabilityDoc.data();
        if (!availabilityData) return;

        setAvailability(availabilityData);

        const [userDoc, roleDoc, groupDoc] = await Promise.all([
          getDoc(doc(db, 'users', String(availabilityData.user_id))),
          getDoc(doc(db, 'roles', String(availabilityData.role_id))),
          getDoc(doc(db, 'groups', String(availabilityData.group_id)))
        ]);

        setUser(userDoc.data());
        setRole(roleDoc.data());
        setGroup(groupDoc.data());
      } catch (error) {
        console.error("Error loading availability details:", error);
      }
    };

    fetchData();
  }, [availabilityId]);

  if (!availability || !user || !role || !group) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Availability Details</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.name}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{role.role_name || "Unknown"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Group</Text>
          <Text style={styles.value}>{group.name || "Unknown"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{availability.location || "Geolocated"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  card: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 30,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginBottom: 40,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 20,
    fontFamily: FONTS.regular,
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: '#000',
  },
});
