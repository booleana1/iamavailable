import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

import AccountInfo from '../components/Profile/OthersProfile';
import Sidebar from '../components/Profile/ProfileSidebar';
import SendMessageButton from '../components/SendMessageButton';
import { COLORS } from '../styles/theme';
import { useUser } from '../context/UserContext';
import { db } from '../../firebase.config';

const makePairId = (a, b) => [String(a), String(b)].sort().join('_');

/**
 * Recupera ou cria o chat entre uid1 (logado) e uid2.
 * Retorna { chatId, userId, updatedAt } – sem buscar dados extras do usuário.
 */
export async function getOrCreateChat(loggedUserId, otherUserId) {
    const pairId = makePairId(loggedUserId, otherUserId);
    const chatRef = doc(db, 'chats', pairId);

    let chatData;
    const snap = await getDoc(chatRef);

    if (snap.exists()) {
        chatData = snap.data();
    } else {
        const now = serverTimestamp();
        chatData = {
            pairId,
            participants: [String(loggedUserId), String(otherUserId)],
            createdAt: now,
            updatedAt: now,
        };
        await setDoc(chatRef, chatData);
    }

    return {
        chatId: pairId,
        userId: String(otherUserId),
        updatedAt: chatData.updatedAt ?? null,
    };
}

/* ---------- component ---------- */
export default function OthersProfileScreen() {
    const route = useRoute();
    const { userId } = route.params;
    const navigation = useNavigation();
    const { loggedUserId } = useUser();

    const [chat, setChat] = useState(null);

    useEffect(() => {
        if (!loggedUserId || !userId) return;

        (async () => {
            const c = await getOrCreateChat(loggedUserId, userId);
            setChat(c);
        })();
    }, [loggedUserId, userId]);

    const handleSendMessage = () => {
        if (!chat) return;
        navigation.navigate('Messages', {
            screen: 'ChatWindow',
            params: { chat },
        });
    };

    return (
        <View style={styles.container}>
            <AccountInfo userId={userId} />
            <Sidebar />

            <View style={styles.sendMessageButtonContainer}>
                <SendMessageButton onPress={handleSendMessage} />
            </View>
        </View>
    );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    sendMessageButtonContainer: {
        position: 'absolute',
        top: 375,
        left: 750,
    },
});
