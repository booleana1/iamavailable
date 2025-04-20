import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FONTS, COLORS } from '../../styles/theme';
import initialData from '../../data/initial_data';

export default function CalendarDetails({ availabilityId }) {
  const availability = initialData.availabilities[availabilityId];

  if (!availability || !availability.start_date) {
    return <Text style={styles.errorText}>Availability Not Found.</Text>;
  }

  const dateTime = new Date(availability.start_date);
  const formattedDate = dateTime.toISOString().split('T')[0]; 
  const formattedTime = dateTime.toTimeString().slice(0, 5);  

  const markedDate = {
    [formattedDate]: {
      selected: true,
      selectedColor: 'blue',
      marked: true,
      dotColor: 'white',
    },
  };

  return (
    <View style={styles.container}>

      <Calendar
        current={formattedDate}
        markedDates={markedDate}
        hideExtraDays={true}
        disableAllTouchEventsForDisabledDays={true}
        style={styles.calendar}
      />

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>Hour</Text>
          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>{formattedTime}</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>{availability.periodicity}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:'4.5%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  calendar: {
    width: 350,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '20%',
    gap: 20,
  },
  field: {
    flex: 1,
  },
  label: {
    fontSize: 20,
    fontFamily: FONTS.regular,
    marginBottom: 8,
  },
  readOnlyBox: {
    height: 50,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  readOnlyText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  errorText: {
    marginTop: 40,
    fontSize: 16,
    textAlign: 'center',
  },
});
