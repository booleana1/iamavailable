import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SidePanelChat, { NEW_CHAT } from "../components/SidePanelChat";
import EmptyState from "../components/EmptyState";
import NewChat from "../components/NewChat";
import ChatWindow from "../components/ChatWindow";
import { COLORS } from "../styles/theme";

const MessageScreen = ({loggedUserId, data}) => {

    const [selected, setSelected] = useState(null);

    const renderContent = () => {
        if (selected === NEW_CHAT) {
            return <NewChat onStart={(userId) => setSelected(userId)} />;
        }
        if (selected == null) {
            return <EmptyState />;
        }
        // userId -> secondary user | loggedUserId -> main user
        return <ChatWindow userId={selected} loggedUserId={loggedUserId} data={data} />;
    };

    return (
        <View style={styles.container}>

        <View style={styles.body}>
                <SidePanelChat selected={selected} onChange={setSelected} loggedUserId={loggedUserId} data={data} />
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