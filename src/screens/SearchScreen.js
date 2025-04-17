import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { COLORS } from '../styles/theme';

export default function SearchScreen(){
    return(
        <View style = {styles.container}>
            <Header/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
})