import React from 'react';
import { View, StyleSheet} from 'react-native';
import Header from '../components/Header';
import Calendar from '../components/Availability/CalendarComp';
import Map from '../components/Availability/MeetingMap';
import { COLORS } from '../styles/theme';

export default function CreateAvailabilityScreen() {


  return (
    <View style={styles.container}>
      <Header />
      <Calendar />
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
