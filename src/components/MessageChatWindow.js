import React, {useState, useEffect} from "react";
import {View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import {COLORS} from "../styles/theme";
import {Ionicons} from "@expo/vector-icons";
import IconPressButton from "./IconPressButton";
import {CHAT} from "../styles/chat";

// ─────────────────────────────── UTILS ─────────────────────────────── //
const getChatMessages = (data, userId, loggedUserId) => {
    return Object.values(data)
        .filter(
            (m) =>
                (m.sender_id === userId && m.receiver_id === loggedUserId) ||
                (m.sender_id === loggedUserId && m.receiver_id === userId)
        )
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const MessageChatWindow = ({userId, loggedUserId, data}) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const msgs = getChatMessages(data, userId, loggedUserId);
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
        <View style={item.sender_id === loggedUserId ? CHAT.outgoing : [CHAT.incoming,styles.incoming]}>
            <Text
                style={item.sender_id === loggedUserId ? CHAT.messageTextOutgoing : CHAT.messageTextIncoming}>{item.content}</Text>
        </View>
    );

    return (
        <View style={[CHAT.container, styles.container]}>
            <FlatList
                data={messages}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
            />
            <View style={[CHAT.inputContainer, {padding: 30}]}>
                <TextInput
                    style={CHAT.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Write your message"
                />
                <IconPressButton
                    icon="send-outline"
                    color={COLORS.primary}
                    size={30}
                    styleTouchable={CHAT.sendButton}
                    onPress={handleSend}
                />
            </View>
        </View>
    );
};

export default MessageChatWindow;

const styles = StyleSheet.create({
    container: {
        padding: 30,
    },
    incoming: {
        backgroundColor: COLORS.gray,
    }
})
