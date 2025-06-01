import React from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FONTS, COLORS } from '../../styles/theme';

export default function CalendarComp({ date, setDate, hour, setHour, endHour, setEndHour }) {
  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setDate(day.dateString)}
        markedDates={{
          [date]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
        style={styles.calendar}
      />

      <View style={styles.hourRow}>
        <View style={styles.field}>
          <Text style={styles.label}>Start Hour</Text>
          <TextInput
            value={hour}
            onChangeText={setHour}
            placeholder="e.g. 14:00"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>End Hour</Text>
          <TextInput
            value={endHour}
            onChangeText={setEndHour}
            placeholder="e.g. 16:00"
            style={styles.input}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  calendar: {
    width: 400,
    borderRadius: 10,
    elevation: 2,
    marginTop: '5%',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  field: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
