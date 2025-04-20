import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
import {COLORS} from "../styles/theme";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";

export default function Header({ onChange }) {
    // TODO: change navigability

    const [page, setPage] = useState('');

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() =>{
                    onChange('HomeScreen')
                    setPage('HomeScreen')
                }}>
                <Image source={require('../assets/logo.png')} style={styles.logo}></Image>
            </TouchableOpacity>


            <View style={styles.leftContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() =>{
                        onChange('MessageScreen')
                        setPage('MessageScreen')
                    }}
                >
                    <Text style={[styles.buttonText, page ==='MessageScreen' && styles.selected]}>Messages</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() =>{
                        onChange('GroupScreen')
                        setPage('GroupScreen')
                    }}
                >
                    <Text style={[styles.buttonText, page ==='GroupScreen' && styles.selected]}>Groups</Text>
                </TouchableOpacity>


                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() =>{
                        onChange('SettingScreen')
                        setPage('SettingScreen')
                    }}
                >
                    <View style={styles.avatarWrapper}>
                        <Ionicons name="person" size={24} />
                    </View>
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
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30
    },
    logo: {
        marginLeft: 70,
        width: 140,
        height: 70,
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
        paddingVertical: 8,
        paddingRight: 20
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 24,
    },
    selected:{
        textDecorationLine: 'underline',
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'white',
    },
    avatarWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor:  COLORS.border,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
});
