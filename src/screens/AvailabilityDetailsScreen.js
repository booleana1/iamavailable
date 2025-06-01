import { View, StyleSheet } from 'react-native';
import AvailabilityDetails from '../components/AvailabilityDetails/AvailabilityDetails';
import DoneButton from '../components/DoneButton';  // importa el botón
import { COLORS } from '../styles/theme';
import {useNavigation} from "@react-navigation/native";

export default function AvailabilityDetailsScreen({route}) {
    const navigation = useNavigation();
    const {availabilityId} = route.params;

  const handleDonePress = () => {
    // Aquí iría la lógica para cambiar de pantalla
      navigation.goBack();
      console.log('Done pressed');
  };

  return (
    <View style={styles.container}>
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
