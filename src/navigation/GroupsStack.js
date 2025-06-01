import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SidePanel from "../components/Group/SidePanel";
import EmptyState from "../components/EmptyState";
import {COLORS} from "../styles/colors";
import GroupChatWindow from "../components/Group/GroupChatWindow";
import GroupManagement from "../components/Group/GroupManagement";
import GroupInfo from "../components/Group/GroupInfo";
import BlurredAddUser from "../components/Group/BlurredAddUser";
import BlurredGroupManagement from "../components/Group/BlurredGroupManagement";
import GroupDontBelong from "../components/Group/GroupDontBelong";
import BlurredGroupRequests from "../components/Group/BlurredGroupRequests";

const Stack = createNativeStackNavigator();



const GroupsStack = () => {
    return (
        <View style={styles.body}>
            <SidePanel/>
            <Stack.Navigator id="GroupsStack" screenOptions={{ headerShown: false }} >
                <Stack.Screen name="GroupsMain" component={EmptyState} />
                <Stack.Screen name="GroupWindow" component={GroupChatWindow} />
                <Stack.Screen name="GroupSettings" component={GroupManagement} />
                <Stack.Screen name="AddUser" component={BlurredAddUser} />

                <Stack.Screen name="GroupMembers" component={GroupInfo} />
                <Stack.Screen name="GroupEditMembers" component={BlurredGroupManagement} />
                <Stack.Screen name="GroupRequests" component={BlurredGroupRequests} />


                <Stack.Screen name="JoinGroup" component={GroupDontBelong} />



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
