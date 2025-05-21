import { View, StyleSheet } from 'react-native';
import FormsForgotPassword from '../components/FormsForgotPassword';
import { COLORS } from '../styles/theme';



export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <FormsForgotPassword/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
