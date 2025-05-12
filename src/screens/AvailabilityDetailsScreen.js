import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import AvailabilityDetails from '../components/AvailabilityDetails/AvailabilityDetails';
import CalendarDetails from '../components/AvailabilityDetails/CalendarDetails';
import LocationDetails from '../components/AvailabilityDetails/LocationDetails';
import { COLORS } from '../styles/theme';


export default function AvailabilityDetailsScreen({availabilityId}) {
    return (
        <View style={styles.container}>
            <Header/>
            <AvailabilityDetails availabilityId={availabilityId}/>
            <Sidebar/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
