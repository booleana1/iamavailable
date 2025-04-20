import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FONTS, COLORS } from '../../styles/theme';

const CalendarComp = forwardRef((props, ref) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState('');

  useImperativeHandle(ref, () => ({
    getCalendarData() {
      return {
        start_date: selectedDate ? `${selectedDate}T${time}:00` : '',
        end_date: selectedDate ? `${selectedDate}T${time}:00` : '',
      };
    },
    clearCalendar() {
      setSelectedDate(null);
      setTime('');
    },
  }));

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
        style={styles.calendar}
      />

      <View style={styles.field}>
        <Text style={styles.label}>Hour</Text>
        <TextInput
          placeholder="e.g. 15:30"
          style={styles.input}
          value={time}
          onChangeText={setTime}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  calendar: {
    width: 280,
    borderRadius: 10,
    elevation: 2,
    marginTop: '25%',
  },
  field: {
    marginTop: '1%',
    marginBottom: 24,
    marginRight: '7%',
  },
  label: {
    fontSize: 20,
    fontFamily: FONTS.regular,
    marginLeft: '12.5%',
    marginBottom: 8,
    textAlign: 'left',
  },
  input: {
    width: '75%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    paddingLeft: 12,
    marginLeft: '11%',
  },
});

export default CalendarComp;
