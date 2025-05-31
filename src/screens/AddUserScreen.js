import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import BlurredAddUser from '../components/BlurredAddUser';
import { COLORS } from '../styles/theme';


export default function AddUserScreen() {
    return (
        <View style={styles.container}>
            <Header/>
            <BlurredAddUser loggedUserId={1}/>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});