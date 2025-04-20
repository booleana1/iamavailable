import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { FONTS, COLORS } from '../../styles/theme'; // Ajusta la ruta según tu estructura

export default function CalendarComp() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
        style={styles.calendar}
      />

      <View style={styles.field}>
        <Text style={styles.label}>Hour</Text>
        <TextInput placeholder="e.g. 15:30" style={styles.input}/>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  calendar: {
    width: 400,
    borderRadius: 10,
    elevation: 2,
    marginTop: '25%',
  },
  field: {
    marginTop:'1%',
    marginBottom: 24,
    marginRight:'7%',
  },
  label: {
    fontSize: 20,
    fontFamily: FONTS.regular,
    marginLeft:'12.5%',
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
    marginLeft:'11%',
  },
});
