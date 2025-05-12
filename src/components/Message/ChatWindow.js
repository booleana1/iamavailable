import React, {useState, useEffect, useRef} from "react";
import {View, FlatList, Text, TextInput, StyleSheet} from "react-native";
import {COLORS} from "../../styles/theme";
import IconPressButton from "../IconPressButton";
import {CHAT} from "../../styles/chat";
import {app, db, auth} from '../../../firebase.config'
import {collection,  query, doc, writeBatch, onSnapshot} from "firebase/firestore";

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const ChatWindow = ({chat, loggedUserId}) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    // allows auto scrolling to last msg sent
    const flatListRef = useRef(null);

    // get messages
    useEffect(() => {

        if(!chat){return;}
        const msgQuery = query(
            collection(db, 'chats', chat.chatId, 'messages'),
        );

        const unsubscribe = onSnapshot(msgQuery, (snapshot) => {
            const msgData = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            ;

            setMessages(msgData);
        });

        return () => unsubscribe();


    }, [chat]);


    const handleSend = async () => {
        const cleanText = text.trim();
        if (!cleanText) return;

        const newMsg = {
            sender_id:   loggedUserId,
            receiver_id: chat.userId,
            content:     cleanText,
            created_at:  new Date().toISOString().replace('Z', '')
        };

        // refs
        const chatRef = doc(db, 'chats', chat.chatId);
        const msgRef  = doc(collection(chatRef, 'messages'));

        // batch
        const batch = writeBatch(db);
        batch.set(msgRef, newMsg);
        batch.update(chatRef, { updatedAt: new Date().toISOString().replace('Z', '') });

        await batch.commit();
        setText('');
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
                ref={flatListRef}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            <View style={[CHAT.inputContainer, {padding: 30}]}>
                <TextInput
                    style={CHAT.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Write your message"
                    onSubmitEditing={handleSend}
                    blurOnSubmit={false}
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

export default ChatWindow;

const styles = StyleSheet.create({
    container: {
        padding: 30,
    },
    incoming: {
        backgroundColor: COLORS.gray,
    }
})
