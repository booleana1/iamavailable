import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CalendarComp from './CalendarComp';
import LocationMap from './LocationMap';
import { COLORS, FONTS } from '../../styles/theme';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.config';

export default function AvailabilityDetails({ availabilityId }) {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const q = query(
          collection(db, 'availabilities'),
          where('id', '==', Number(availabilityId))
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setAvailability(docData);
        } else {
          alert('Availability not found');
          setAvailability(null);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        setAvailability(null);
      } finally {
        setLoading(false);
      }
    }

    if (availabilityId) {
      fetchAvailability();
    }
  }, [availabilityId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading availability...</Text>
      </View>
    );
  }

  if (!availability) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>No availability data to display.</Text>
      </View>
    );
  }

  const {
    name = '-',
    role_id,
    group_id,
    location,
    periodicity = '-',
    start_date,
    end_date,
    latitude,
    longitude,
  } = availability;

  const role = role_id != null ? String(role_id) : '-';
  const group = group_id != null ? String(group_id) : '-';
  const link = location || '-';

  const date = start_date ? start_date.split('T')[0] : null;
  const hour = start_date && start_date.includes('T') ? start_date.split('T')[1].slice(0, 5) : '';
  const endHour = end_date && end_date.includes('T') ? end_date.split('T')[1].slice(0, 5) : '';

  const isValidCoord = (v) => typeof v === 'number' && !isNaN(v);
  const lat = isValidCoord(latitude) ? latitude : null;
  const lng = isValidCoord(longitude) ? longitude : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Availability Details</Text>

      <View style={styles.row}>
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.input}>{name}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.input}>{role}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Group Hashtag</Text>
            <Text style={styles.input}>{group}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Link (if online)</Text>
            <Text style={styles.input}>{link}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Periodicity</Text>
            <Text style={styles.input}>{periodicity}</Text>
          </View>
        </View>

        <View style={styles.calendar}>
          <CalendarComp
            date={date}
            setDate={() => {}}
            hour={hour}
            setHour={() => {}}
            endHour={endHour}
            setEndHour={() => {}}
            readonly
          />
        </View>

        <View style={styles.map}>
          {lat != null && lng != null ? (
            <LocationMap latitude={lat} longitude={lng} readonly />
          ) : (
            <Text>No location data available</Text>
          )}
        </View>
      </View>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 6,
  },
});
