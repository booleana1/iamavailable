import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import UserInfo from '../components/Profile/UserInfo';
import Sidebar from '../components/Profile/ProfileSidebar';
import { COLORS } from '../styles/theme';


export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Header/>
            <UserInfo loggedUserId={5}/>
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
