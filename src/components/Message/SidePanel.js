import React, {useState, useMemo, useCallback, useEffect} from "react";
import {View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet,Image} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIDEPANEL, GLOBAL } from "../../styles/theme";
import {app, db, auth} from '../../../firebase.config'
import {collection,  query, where, onSnapshot, doc, getDoc, Timestamp, orderBy} from "firebase/firestore";


// ─────────────────────────────── CONSTANT ─────────────────────────────── //
export const NEW_CHAT = "__NEW_CHAT__";

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const SidePanel = ({ selected, onChange, loggedUserId}) => {
    const [search, setSearch] = useState('');
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        if (!loggedUserId) return;

        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', String(loggedUserId))
        );

        const unsubscribe = onSnapshot(q, async snap => {
            // get the other participant id in 'chats'
            const rows = snap.docs.map(d => {
                const { participants, updatedAt } = d.data();
                const otherId = participants.find(uid => uid !== String(loggedUserId));
                return otherId ? { chatId: d.id, userId: otherId, updatedAt } : null;
            }).filter(Boolean)
                .sort((a, b) => b.updatedAt - a.updatedAt);

            // get the other user data
            const withProfile = await Promise.all(
                rows.map(async r => {
                    const snap = await getDoc(doc(db, 'users', String(r.userId)));
                    return snap.exists() ? { ...r, ...snap.data() } : null;
                })
            );

            setContacts(withProfile.filter(Boolean));
        });

        return () => unsubscribe();
    }, [loggedUserId]);

    const filtered = useMemo(() => {
        return contacts
            .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => b.updatedAt - a.updatedAt);
    }, [contacts, search]);

    const handleSelect = useCallback(
        (value) => {
            onChange?.(value);
        },
        [onChange]
    );

    const renderItem = ({ item }) => {
        const isActive = selected === item;
        return (
            <TouchableOpacity
                style={[SIDEPANEL.item, isActive && SIDEPANEL.itemSelected]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.6}
            >
                <View style={GLOBAL.avatarWrapperMsg}>
                    {item.photo_url && item.photo_url.startsWith('data:image') ? (
                        <Image
                            source={{ uri: item.photo_url }}
                            style={GLOBAL.avatarMsg}
                        />
                    ) : (
                        <Ionicons name="person" size={24} color="#000" />
                    )}
                </View>
                <Text style={SIDEPANEL.name}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={SIDEPANEL.container}>
            {/* Search bar */}
            <View style={SIDEPANEL.searchContainer}>
                <Ionicons name="search" size={18} style={SIDEPANEL.searchIcon} />
                <TextInput
                    style={SIDEPANEL.searchInput}
                    placeholder="Search contacts"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Contact list */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={SIDEPANEL.separator} />}
                showsVerticalScrollIndicator={false}
                style={SIDEPANEL.list}
            />

            {/* New Chat button */}
            <View style={styles.newChatContainer}>
                <TouchableOpacity
                    onPress={() => handleSelect(NEW_CHAT)}
                    style={styles.newChatButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="add-circle-outline" size={56} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SidePanel;

// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({
    newChatContainer: {
        alignItems: "center",
        paddingVertical: 12,
    },
    newChatButton: {
        alignItems: "center",
        justifyContent: "center",
    },
});