import React, {useState, useEffect} from "react";
import {View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import {COLORS} from "../styles/theme";
import {Ionicons} from "@expo/vector-icons";
import IconPressButton from "./IconPressButton";


// ─────────────────────────────── UTILS ─────────────────────────────── //
const getChatMessages = (data, userId, loggedUserId) =>{
    return Object.values(data)
        .filter(
            (m) =>
                (m.sender_id === userId && m.receiver_id === loggedUserId) ||
                (m.sender_id === loggedUserId && m.receiver_id === userId)
        )
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const ChatWindow = ({userId, loggedUserId, data}) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const msgs = getChatMessages(data,userId, loggedUserId);
        setMessages(msgs);
    }, [userId, data]);

    const handleSend = () => {
        if (!text.trim()) return;
        const newMsg = {
            id: Date.now(),
            sender_id: loggedUserId,
            receiver_id: userId,
            content: text.trim(),
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMsg]);
        setText("");
    };

    // compare if the sender ID is the logged user or not
    const renderItem = ({item}) => (
        <View style={item.sender_id === loggedUserId ? styles.outgoing : styles.incoming}>
            <Text style={item.sender_id === loggedUserId ? styles.messageTextOutgoing: styles.messageTextIncoming}>{item.content}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Write your message"
                />
                <IconPressButton
                    icon="send-outline"
                    color={COLORS.primary}
                    size={30}
                    styleTouchable={styles.sendButton}
                    onPress={handleSend}
                />
            </View>
        </View>
    );
};

export default ChatWindow;

// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: "#fff"
    },
    incoming: {
        alignSelf: "flex-start",
        backgroundColor: COLORS.gray,
        borderRadius: 30,
        marginVertical: 4,
        padding: 12,
        paddingHorizontal:20,
        maxWidth: "80%"
    },
    outgoing: {
        alignSelf: "flex-end",
        backgroundColor: COLORS.primary,
        borderRadius: 30,
        marginVertical: 4,
        padding: 12,
        paddingHorizontal:20,
        maxWidth: "80%"

    },
    messageTextIncoming: {
        color: COLORS.text,
        fontSize: 14
    },
    messageTextOutgoing: {
        color: COLORS.white,
        fontSize: 14
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 18,
        backgroundColor: COLORS.gray,
        color: COLORS.text,
    },
    sendButton: {marginLeft: 8, padding: 8},

});
