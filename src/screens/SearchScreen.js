import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import DataList from '../components/Search/showSearch';
import { COLORS } from '../styles/theme';
import DoneButton from "../components/DoneButton";
import {useNavigation, useRoute} from "@react-navigation/native";



export default function SearchScreen(){
    const navigation = useNavigation();
    const route = useRoute();
    const { inputValue } = route.params;

    const handleDonePress = () => {
        // Aquí iría la lógica para cambiar de pantalla
        navigation.goBack();
        console.log('Done pressed');
    };

    return(
        <View style = {styles.container}>
            <DataList inputValue={inputValue}/>
            <View style={styles.doneButtonContainer}>
                <DoneButton onPress={handleDonePress} />
            </View>
        </View>
    )
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
})