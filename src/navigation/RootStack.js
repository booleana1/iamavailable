import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {View} from "react-native";
import Header from "../components/Header";
import HomeScreen from "../screens/HomeScreen";
import React from "react";
import SettingsDrawer from "./SettingsDrawer";
import MessagesStack from "./MessagesStack";
import GroupStack from "./GroupsStack";
import NewChat from "../components/Message/NewChat";
import FormsCreateGroupsScreen from "../components/FormsCreateGroupsScreen";
import Forms from "../components/Availability/AvailabilityForm";
import ProfileScreen from "../screens/ProfileScreen";
import AvailabilityDetailsScreen from "../screens/AvailabilityDetailsScreen";
import SearchScreen from "../screens/SearchScreen";
import ManageAvailabilityScreen from "../screens/ManageAvailabilityScreen";
import OthersProfileScreen from "../screens/OthersProfileScreen";

const Stack = createNativeStackNavigator();

export default function RootStack() {
    return(
        <View style={{flex:1}}>
            <Header/>
            <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Messages" component={MessagesStack} />
                <Stack.Screen name="Groups" component={GroupStack} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Settings" component={SettingsDrawer} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="OthersProfile" component={OthersProfileScreen} />
                <Stack.Screen name="CreateChat" component={NewChat} />
                <Stack.Screen name="CreateGroup" component={FormsCreateGroupsScreen} />
                <Stack.Screen name="CreateAvailability" component={Forms} />
                <Stack.Screen name="AvailabilityDetails" component={AvailabilityDetailsScreen} />
                <Stack.Screen name="ManageAvailabilityScreen" component={ManageAvailabilityScreen} />

            </Stack.Navigator>
        </View>

    );
}