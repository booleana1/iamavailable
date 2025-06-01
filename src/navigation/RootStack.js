import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {View} from "react-native";
import Header from "../components/Header";
import HomeScreen from "../screens/HomeScreen";
import MessageScreen from "../screens/MessageScreen";
import GroupScreen from "../screens/GroupScreen";
import React from "react";
import SettingsDrawer from "./SettingsDrawer";

const Stack = createNativeStackNavigator();

export default function RootStack() {
    return(
        <View style={{flex:1}}>
            <Header/>
            <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Messages" component={MessageScreen} />
                <Stack.Screen name="Groups" component={GroupScreen} />
                <Stack.Screen name="Profile" component={SettingsDrawer} />
            </Stack.Navigator>
        </View>

    );
}