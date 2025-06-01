import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import UserInfo from '../components/Profile/UserInfo';
import Sidebar from '../components/Profile/ProfileSidebar';
import { COLORS } from '../styles/theme';
import {useRoute} from "@react-navigation/native";
import {useContext} from "react";


export default function ProfileScreen() {
    const route = useRoute();
    const {userId} = route.params;
    return (
        <View style={styles.container}>
            <UserInfo userId={userId} />
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
