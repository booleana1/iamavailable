import { View, StyleSheet } from 'react-native';
import FormsLogin from '../components/FormsLogin';
import { COLORS } from '../styles/theme';



export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <FormsLogin/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
