import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity, useWindowDimensions} from 'react-native';
import {COLORS} from "../styles/theme";

export default function Header() {

    const {width} = useWindowDimensions();
    const isSmallScreen = width < 768;

    return (
        <View style={styles.container}>

            <Image source={require('../assets/logo.png')} style={[styles.logo, isSmallScreen && styles.logoSmallScreens]}></Image>

            <View style={{flexDirection: 'row', alignItems: 'center', gap: 40}}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Messages</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Groups</Text>
                </TouchableOpacity>


                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                />

                <TouchableOpacity style={styles.button}>
                    <Image
                        source={{uri: 'https://example.com/photos/ana.jpg'}}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5,
    },
    logo: {
        width: 100,
        height: 50,
    },
    searchContainer: {
        position: 'relative',
        marginHorizontal: 8,
    },
    searchInput: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingVertical: 6,
        paddingLeft: 10,
        paddingRight: 12,
        fontSize: 18,
        minWidth: 20,
    },
    button: {
        paddingVertical: 8
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 24,
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'white',
    },
    /*Small Screens*/
    logoSmallScreens: {
        width: 60,
        height: 30,
    },
    searchInputSmallScreens: {
        fontSize: 14,
    },
    buttonTextSmallScreens: {
        fontSize: 16,
    },
    profileImageSmallScreens: {
        width: 36,
        height: 36,
    },
});
