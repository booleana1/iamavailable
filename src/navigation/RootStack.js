import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {View} from "react-native";
import Header from "../components/Header";
import HomeScreen from "../screens/HomeScreen";
import GroupScreen from "../screens/GroupScreen";
import React from "react";
import SettingsDrawer from "./SettingsDrawer";
import MessagesStack from "./MessagesStack";
import GroupStack from "./GroupsStack";

const Stack = createNativeStackNavigator();

export default function RootStack() {
    return(
        <View style={{flex:1}}>
            <Header/>
            <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Messages" component={MessagesStack} />
                <Stack.Screen name="Groups" component={GroupStack} />
                <Stack.Screen name="Profile" component={SettingsDrawer} />
                <Stack.Screen name="Search" component={HomeScreen} />
                <Stack.Screen name="CreateChat" component={HomeScreen} />
                <Stack.Screen name="CreateGroup" component={HomeScreen} />
                <Stack.Screen name="CreateAvailability" component={HomeScreen} />
            </Stack.Navigator>
        </View>

    );
}