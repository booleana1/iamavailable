import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import initialData from '../../data/initial_data';
import { COLORS, FONTS } from '../../styles/theme';

export default function AvailabilityDetails({ availabilityId }) {
  const availability = initialData.availabilities[availabilityId];

  if (!availability) {
    return <Text>Availability Not Found.</Text>;
  }

  const user = initialData.users[availability.user_id];
  const role = initialData.roles[availability.role_id];
  const group = initialData.groups[availability.group_id];

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
          <Text style={styles.value}>{role?.role_name || "Desconocido"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Group</Text>
          <Text style={styles.value}>{group?.name || "Desconocido"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Link </Text>
          <Text style={styles.value}>{availability.link ?? "Geolocated"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    left: 150,
    top: 150,
    backgroundColor: COLORS.background,
  },
  card: {
    width: '100%',
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
    marginLeft: '12.5%',
    marginBottom: 8,
    textAlign: 'left',
  },
  value: {
    width: '75%',
    height: 50,
  
    paddingLeft: 12,
    marginLeft: '12.5%',
    paddingTop: 12,
    fontFamily: FONTS.regular,
    color: '#000',
  },
});
