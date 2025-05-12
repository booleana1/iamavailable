import React, { useState, useEffect, useCallback, useMemo } from "react";
import {View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList} from "react-native";
import { COLORS } from "../../styles/theme";
import {GLOBAL} from "../../styles/global";
import { collection, query, where, limit, getDocs,
    addDoc,  serverTimestamp, orderBy, startAt, endAt} from 'firebase/firestore';
import { db } from '../../../firebase.config';


const makePairId = (a, b) => [a, b].sort().join('_');

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const NewChat = ({ onStart, loggedUserId }) => {
    const [queryText, setQueryText] = useState("");
    const [allUsers, setAllUsers]   = useState([]);

    // compute suggestions from users
    useEffect(() => {
        (async () => {
            try {
                const snap = await getDocs(collection(db, 'users'));
                const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setAllUsers(list);
            } catch (e) {
                console.error( e);
            }
        })();
    }, []);

    const suggestions = useMemo(() => {
        const q = queryText.trim().toLowerCase();
        if (!q) return [];
        return allUsers
            .filter(u => u.name.toLowerCase().includes(q))
            .slice(0, 5);
    }, [queryText, allUsers]);

    const handleStart = useCallback(async () => {
        const clean = queryText.trim();
        if (!clean) return;

        const selected = suggestions.find(u => u.name === clean);
        if (!selected) return;

        const otherId = selected.id;
        const pairId  = makePairId(loggedUserId, otherId);
        const now     = serverTimestamp();

        try {
            const q = query(
                collection(db, 'chats'),
                where('pairId', '==', pairId),
                limit(1)
            );
            const snap = await getDocs(q);

            let chatDoc, chatId;

            if (snap.empty) {
                chatDoc = {
                    pairId,
                    participants: [loggedUserId, otherId],
                    createdAt: now,
                    updatedAt: now
                };
                const docRef = await addDoc(collection(db, 'chats'), chatDoc);
                chatId = docRef.id;
            } else {
                const docSnap = snap.docs[0];
                chatId  = docSnap.id;
                chatDoc = docSnap.data();
            }

            const chatInfo = {
                id:       chatId,
                chatId,
                userId:   otherId,
                name:     selected.name,
                updatedAt: chatDoc.updatedAt || now
            };

            onStart?.(chatInfo);
            setQueryText('');
        } catch (e) {
            console.error(e);
        }
    }, [queryText, suggestions, loggedUserId, onStart]);


    const handleSelect = name => setQueryText(name);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Chat</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={'#999'}
                    value={queryText}
                    onChangeText={setQueryText}
                />
                {suggestions.length > 0 && (
                    <View style={GLOBAL.suggestionsBox}>
                        <FlatList
                            data={suggestions}
                            keyExtractor={item => String(item.id)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={GLOBAL.suggestionRow}
                                    onPress={() => handleSelect(item.name)}
                                >
                                    <Text style={GLOBAL.suggestionText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
                <TouchableOpacity style={styles.button} onPress={handleStart}>
                    <Text style={styles.buttonText}>Start Chat</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

export default NewChat;

// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        color: COLORS.text,
    },
    input: {
        width: "100%",
        height: 48,
        borderColor: '#999',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: COLORS.white,
        color: COLORS.text,
    },

    button: {
        width: '100%',
        marginTop: 16,
        paddingVertical: 12,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        alignItems: "center",
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
    },
    inputContainer: {
        width: "20%",
        alignItems: "center",
        gap: 20
    }
});
