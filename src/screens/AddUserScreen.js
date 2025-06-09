import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import BlurredAddUser from '../components/BlurredAddUser';
import { COLORS } from '../styles/theme';

export default function AddUserScreen({ navigation, route }) {
    const { loggedUserId } = route.params || {};

    return (
        <View style={styles.container}>
            <Header />
            <BlurredAddUser navigation={navigation} loggedUserId={loggedUserId} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
