import {StyleSheet, View} from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import EmptyState from "../components/EmptyState";
import NewChat from "../components/Message/NewChat";
import ChatWindow from "../components/Message/ChatWindow";
import {COLORS} from "../styles/colors";
import SidePanel from "../components/Message/SidePanel";

const Stack = createNativeStackNavigator();

const MessagesStack = () => {

    return (
        <View style={styles.body}>
            <SidePanel/>
            <Stack.Navigator id="MessagesStack" screenOptions={{ headerShown: false }} >
                <Stack.Screen name="MessagesMain" component={EmptyState} />
                <Stack.Screen name="NewChat" component={NewChat} />
                <Stack.Screen name="ChatWindow" component={ChatWindow} />
            </Stack.Navigator>
        </View>

    )
}
export default MessagesStack

const styles = StyleSheet.create({

    body: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.background,
    },
});
