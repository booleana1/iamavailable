import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {COLORS} from "../styles/colors";
import Account from "../components/Settings/Account";
import Security from "../components/Settings/Security";
import Notifications from "../components/Settings/Notifications";
import React from "react";
import {createDrawerNavigator, DrawerItemList} from "@react-navigation/drawer";


 function SettingsNav(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>
            <DrawerItemList {...props} />
        </View>
    );
}

const Drawer = createDrawerNavigator();

export default function SettingsDrawer() {

    return (
        <Drawer.Navigator
            id='SettingsDrawer'
            defaultStatus="open"
            drawerContent={(props) => <SettingsNav {...props} />}
            screenOptions={{
                drawerType: 'permanent',
                headerShown: false,
                drawerStyle: styles.container,
                drawerItemStyle: styles.button,
                drawerActiveTintColor: COLORS.white,
                drawerInactiveTintColor: COLORS.white,
                drawerActiveBackgroundColor: COLORS.secondary,
                drawerLabelStyle: styles.buttonText,
            }}
        >
            <Drawer.Screen name="Account" component={Account} />
            <Drawer.Screen name="Security" component={Security} />
            <Drawer.Screen name="Notifications" component={Notifications} />
        </Drawer.Navigator>

    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        flexDirection: 'row'
    },
    container: {
        width: 160,
        height: '100%',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 0,
        gap: 20,
    },
    header: {
        paddingTop:40,
        paddingBottom:20,
        color: '#fff',
        fontWeight: '700',
        fontSize: 24,
    },
    button: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 0,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '400',
        fontSize: 18,
        alignSelf: 'center',
    },
});
