import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { COLORS } from "../styles/theme";
import { Ionicons } from '@expo/vector-icons'

export default function Header() {
  return (
    <View style={styles.container}>
        
        <Text style={styles.logo}>Logo</Text>

        <View style={{ flexDirection: 'row' , alignItems: 'center', gap: 16}}>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Groups</Text>
            </TouchableOpacity>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={16} color="#999" style={styles.searchIcon} />
                <TextInput
                    placeholder="Search..."
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                />
            </View>


            <Image
                source={{ uri: 'https://example.com/photos/ana.jpg' }}
                style={styles.profileImage}
            />
        </View>



    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    logo: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchContainer: {
        position: 'relative',
        marginHorizontal: 8,
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
        minWidth: 100,
    },

    button: {
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
    },
    profileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'white',
    },
    });
