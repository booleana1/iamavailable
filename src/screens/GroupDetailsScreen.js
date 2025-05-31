import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import GroupInfo from '../components/GroupInfo';
import DoneButton from '../components/DoneButton';
import { COLORS } from '../styles/theme';

export default function GroupDetailsScreen({ navigation, route }) {
    return (
        <View style={styles.container}>
            <Header/>
            <GroupInfo route={route} loggedUserId={1} />
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
