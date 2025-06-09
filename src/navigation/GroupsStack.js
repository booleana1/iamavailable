import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SidePanel from "../components/Group/SidePanel";
import EmptyState from "../components/EmptyState";
import {COLORS} from "../styles/colors";
import GroupChatWindow from "../components/Group/GroupChatWindow";

const Stack = createNativeStackNavigator();


const GroupsStack = () => {
    return (
        <View style={styles.body}>
            <SidePanel/>
            <Stack.Navigator id="GroupsStack" screenOptions={{ headerShown: false }} >
                <Stack.Screen name="GroupsMain" component={EmptyState} />
                <Stack.Screen name="GroupWindow" component={GroupChatWindow} />
            </Stack.Navigator>
        </View>

    )
}
export default GroupsStack
const styles = StyleSheet.create({
    body: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.background,
    },
})
