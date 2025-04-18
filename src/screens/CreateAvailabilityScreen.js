import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Touchable} from 'react-native';
import Form from '../components/Availability/AvailabilityForm';
import Calendar from '../components/Availability/CalendarComp';
import Header from '../components/Header';
import MeetingMap from '../components/Availability/MeetingMap';
import { COLORS } from '../styles/theme';
import DoneButton from '../components/DoneButton';



export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Header/>
            <Calendar/>
            <Form/>
            <MeetingMap/>
            <DoneButton style={{bottom:80, right:120}}/>                  


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },


});
