import React from 'react';
import { View, StyleSheet} from 'react-native';
import Header from '../components/Header';
import Form from '../components/Availability/AvailabilityForm';
import Calendar from '../components/Availability/CalendarComp';
import Map from '../components/Availability/MeetingMap';
import DoneButton from '../components/DoneButton';
import { COLORS } from '../styles/theme';

export default function CreateAvailabilityScreen() {


  return (
    <View style={styles.container}>
      <Header/>
      <Calendar />
      <Form/>
      <Map />
      <DoneButton style={styles.button}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  button:{
    position:'absolute',
    bottom:'10%',
    right:'8%',
  }
});
