import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import AvailabilityDetails from '../components/AvailabilityDetails/AvailabilityDetails';
import DoneButton from '../components/DoneButton';  // importa el botón
import { COLORS } from '../styles/theme';

export default function AvailabilityDetailsScreen({ availabilityId }) {
  const handleDonePress = () => {
    // Aquí iría la lógica para cambiar de pantalla
    console.log('Done pressed');
  };

  return (
    <View style={styles.container}>
      <Header />
      <AvailabilityDetails availabilityId={availabilityId} />

      {/* Contenedor absoluto para el botón */}
      <View style={styles.doneButtonContainer}>
        <DoneButton onPress={handleDonePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  doneButtonContainer: {
    position: 'absolute',
    bottom: 40,
    right: 40,

  },
});
