import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import DataList from '../components/Search/showSearch';
import { COLORS } from '../styles/theme';

export default function SearchScreen(){
    return(
        <View style = {styles.container}>
            <Header/>
            <DataList/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
})