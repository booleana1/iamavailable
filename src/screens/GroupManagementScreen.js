import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import GroupManagement from '../components/GroupManagement';
import DoneButton from '../components/DoneButton';
import { COLORS } from '../styles/theme';

export default function GroupManagementScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Header/>
            <GroupManagement loggedUserId={1} navigation={navigation}/>
            <DoneButton style={{bottom:80, right:120}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
