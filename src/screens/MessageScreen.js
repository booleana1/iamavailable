import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SidePanel, { NEW_CHAT } from "../components/Message/SidePanel";
import EmptyState from "../components/EmptyState";
import NewChat from "../components/Message/NewChat";
import ChatWindow from "../components/Message/ChatWindow";
import { COLORS } from "../styles/theme";


const MessageScreen = ({loggedUserId, data, dataUsers}) => {
    const [selected, setSelected] = useState(null);

    const renderContent = () => {
        if (selected === NEW_CHAT) {
            return <NewChat onStart={(chat) => setSelected(chat)} loggedUserId={loggedUserId}/>;
        }
        if (selected == null) {
            return <EmptyState />;
        }
        // userId -> secondary user | loggedUserId -> main user
        return <ChatWindow chat={selected} loggedUserId={loggedUserId}/>;
    };

    return (
        <View style={styles.container}>

        <View style={styles.body}>
                <SidePanel selected={selected}
                           onChange={setSelected}
                           loggedUserId={loggedUserId} />
                <View style={styles.content}>{renderContent()}</View>
            </View>
        </View>

    );
};

export default MessageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    body: {
        flex: 1,
        flexDirection: 'row'
    },
    content: {
        flex: 1,
    },
});