import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import GroupDontBelong from '../components/GroupDontBelong';
import DoneButton from '../components/DoneButton';
import { COLORS } from '../styles/theme';


export default function GroupDontBelongScreen() {
    return (
        <View style={styles.container}>
            <Header/>
            <GroupDontBelong loggedUserId={1}/>
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