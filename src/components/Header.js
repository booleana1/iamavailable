import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
import {COLORS} from "../styles/theme";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";

// ─────────────────────────────── CONSTANT ─────────────────────────────── //
const PAGES = {
    HOME: "HomeScreen",
    MESSAGES: "MessageScreen",
    GROUPS: "GroupScreen",
    SETTINGS: "SettingScreen",
};

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
export default function Header({onChange}) {
    // TODO: change navigability

    // this page/setPage is used to underline or not "Messages" and "Groups" on header
    const [page, setPage] = useState('');

    const handlePageChange = (p) => {
        onChange(p);
        setPage(p);
    }

    return (
        <View style={styles.container}>
            {/* Logo */}
            <TouchableOpacity onPress={() => handlePageChange(PAGES.HOME)}>
                <Image source={require('../assets/logo.png')} style={styles.logo}></Image>
            </TouchableOpacity>


            <View style={styles.leftContainer}>
                {/* Messages */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePageChange(PAGES.MESSAGES)}>
                    <Text style={[styles.buttonText, page === PAGES.MESSAGES && styles.selected]}>Messages</Text>
                </TouchableOpacity>

                {/* Groups */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePageChange(PAGES.GROUPS)}>
                    <Text style={[styles.buttonText, page === PAGES.GROUPS && styles.selected]}>Groups</Text>
                </TouchableOpacity>

                {/* Search Bar */}
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                    onSubmitEditing={()=>alert("SearchScreen")}
                />

                {/* Profile (Settings for demo) */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePageChange(PAGES.SETTINGS)}>
                    <View style={styles.avatarWrapper}>
                        <Ionicons name="person" size={24}/>
                    </View>
                </TouchableOpacity>

            </View>

        </View>
    );
}

// ─────────────────────────────── STYLES ─────────────────────────────── //
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
    selected: {
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
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
});
