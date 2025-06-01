import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import AccountInfo from '../components/Profile/OthersProfile';
import Sidebar from '../components/Profile/ProfileSidebar';
import SendMessageButton from '../components/SendMessageButton';
import { COLORS } from '../styles/theme';

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <Header/>
            <AccountInfo loggedUserId={1}/>
            <Sidebar/>

            <View style={styles.sendMessageButtonContainer}>
                <SendMessageButton/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    sendMessageButtonContainer: {
        position: 'absolute',
        top: 375,
        left: 750,
    },
});
