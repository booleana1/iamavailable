import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import FormsCreateGroupsScreen from '../components/FormsCreateGroupsScreen';
import { COLORS } from '../styles/theme';

export default function CreateGroupsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Header/>
            <FormsCreateGroupsScreen navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
