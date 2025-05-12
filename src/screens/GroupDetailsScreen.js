import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import GroupInfo from '../components/GroupInfo';
import DoneButton from '../components/DoneButton';
import { COLORS } from '../styles/theme';


export default function GroupDetailsScreen() {
    return (
        <View style={styles.container}>
            <Header/>
            <GroupInfo loggedUserId={1}/>
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