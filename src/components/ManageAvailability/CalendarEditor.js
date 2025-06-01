import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default class CalendarEditor extends Component {
  render() {
    const { date, onDateChange, hour, onHourChange, endHour, onEndHourChange } = this.props;

    return (
      <View style={styles.container}>
        <Calendar
          onDayPress={(day) => onDateChange(day.dateString)}
          markedDates={{ [date]: { selected: true, marked: true, selectedColor: 'blue' } }}
          style={styles.calendar}
        />

        <View style={styles.hourRow}>
          <View style={styles.field}>
            <Text style={styles.label}>Start Hour</Text>
            <TextInput
              value={hour}
              onChangeText={onHourChange}
              placeholder="14:00"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>End Hour</Text>
            <TextInput
              value={endHour}
              onChangeText={onEndHourChange}
              placeholder="16:00"
              style={styles.input}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  calendar: { marginBottom: 16, borderRadius: 8, elevation: 2 },
  hourRow: { flexDirection: 'row', gap: 10 },
  field: { flex: 1 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 },
});
