import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarComp({ date, setDate, hour, setHour, endHour, setEndHour, readonly }) {
  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={readonly ? undefined : (day) => setDate(day.dateString)}
        markedDates={{
          [date]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
        style={styles.calendar}
        disableAllTouchEventsForDisabledDays={readonly}
      />

      {readonly ? (
        <View style={styles.hourRow}>
          <View style={styles.field}>
            <Text style={styles.label}>Start Hour</Text>
            <Text style={styles.value}>{hour || '-'}</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>End Hour</Text>
            <Text style={styles.value}>{endHour || '-'}</Text>
          </View>
        </View>
      ) : (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  calendar: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2, // sombra en Android
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  field: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
  value: {
    padding: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 4,
  },
});
