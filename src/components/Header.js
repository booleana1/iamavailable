import {View, Text, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native';
import { COLORS, SIDEPANEL, GLOBAL } from "../styles/theme";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {doc,onSnapshot} from "firebase/firestore";
import {app, db, auth} from '../../firebase.config'
import {useNavigation, useNavigationState} from "@react-navigation/native";
import {useUser} from "../context/UserContext";

// ─────────────────────────────── CONSTANT ─────────────────────────────── //
const PAGES = {
    HOME: "Home",
    MESSAGES: "Messages",
    GROUPS: "Groups",
    SETTINGS: "Profile",
};

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
export default function Header() {
    const {loggedUserId} = useUser();
    const [photoUrl, setPhotoUrl] = useState("");
    const navigation = useNavigation();
    const routeName = useNavigationState(state => {
        if (!state || !state.routes) return null;
        return state.routes[state.index]?.name;
    });

    useEffect(() => {
        const userRef = doc(db, 'users', String(loggedUserId));
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.photo_url) {
                    setPhotoUrl(data.photo_url);
                }
            }
        }, (err) => {
            console.log( err);
        });

        return () => unsubscribe();
    }, []);


    return (
        <View style={styles.container}>
            {/* Logo */}
            <TouchableOpacity onPress={() => navigation.navigate(PAGES.HOME)}>
                <Image source={require('../assets/logo.png')} style={styles.logo}></Image>
            </TouchableOpacity>


            <View style={styles.leftContainer}>
                {/* Messages */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate(PAGES.MESSAGES)}>
                    <Text style={[styles.buttonText, routeName === PAGES.MESSAGES && styles.selected]}>Messages</Text>
                </TouchableOpacity>

                {/* Groups */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate(PAGES.GROUPS)}>
                    <Text style={[styles.buttonText, routeName === PAGES.GROUPS && styles.selected]}>Groups</Text>
                </TouchableOpacity>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={18} style={styles.searchIcon} />
                    <TextInput
                    placeholder="Search"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                    onSubmitEditing={()=>alert("SearchScreen")}
                />
                </View>

                {/* Profile (Settings for demo) */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate(PAGES.SETTINGS)}>
                    <View style={GLOBAL.avatarWrapper}>
                        {photoUrl && photoUrl.startsWith('data:image') ? (
                                <Image
                                    source={{ uri: photoUrl }}
                                    style={GLOBAL.avatar}
                                />
                            ) :
                        <Ionicons name="person" size={30} color="#fff" />
                        }
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
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: 'white',
        borderRadius: 20,
        minWidth: 20,
        height: 40,
        marginHorizontal: 16,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
        color: COLORS.text,
    },
    searchInput: {
        paddingVertical: 0,
        paddingLeft: 10,
        paddingRight: 12,
        fontSize: 18,

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


});
