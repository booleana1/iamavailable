import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import MessageSidePanel, { NEW_CHAT } from "../components/MessageSidePanel";
import EmptyState from "../components/EmptyState";
import MessageNewChat from "../components/MessageNewChat";
import MessageChatWindow from "../components/MessageChatWindow";
import { COLORS } from "../styles/theme";

const MessageScreen = ({loggedUserId, data, dataUsers}) => {

    const [selected, setSelected] = useState(null);

    const renderContent = () => {
        if (selected === NEW_CHAT) {
            return <MessageNewChat onStart={(userId) => setSelected(userId)} dataUser={dataUsers} />;
        }
        if (selected == null) {
            return <EmptyState />;
        }
        // userId -> secondary user | loggedUserId -> main user
        return <MessageChatWindow userId={selected} loggedUserId={loggedUserId} data={data} />;
    };

    return (
        <View style={styles.container}>

        <View style={styles.body}>
                <MessageSidePanel selected={selected} onChange={setSelected} loggedUserId={loggedUserId} data={data} />
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