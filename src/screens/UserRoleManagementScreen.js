import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import BlurredGroupManagement from '../components/BlurredGroupManagement';
import { COLORS } from '../styles/theme';


export default function UserRoleManagementScreen() {
    return (
        <View style={styles.container}>
            <Header/>
            <BlurredGroupManagement loggedUserId={1}/>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});