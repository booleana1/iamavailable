import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Touchable} from 'react-native';
import {COLORS} from "../../styles/theme";
import {Ionicons} from '@expo/vector-icons';
import SettingButton from './SettingButton';

export default function Sidebar(){
    return (
        <View style={styles.container}>
            <Text style={styles.account}>Account</Text>
            <SettingButton size={48}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        paddingVertical: 24,
        paddingHorizontal: 16,
        width: 150, // ancho del sidebar
        height: '100%', // altura completa
        alignItems: 'center',
    },
    logo: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    account: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 20,
        marginBottom: 500,
    },
    searchContainer: {
        position: 'relative',
        marginVertical: 16,
    },
    searchIcon: {
        position: 'absolute',
        left: 8,
        top: '50%',
        transform: [{ translateY: -8 }],
    },
    searchInput: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingVertical: 6,
        paddingLeft: 32,
        paddingRight: 12,
        fontSize: 14,
    },
    button: {
        paddingVertical: 10,
        marginBottom: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
        marginTop: 'auto', // Empuja la imagen al fondo del sidebar
        alignSelf: 'center',
    },
})