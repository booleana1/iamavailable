import React, { useState, useMemo, useCallback } from "react";
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import initialData from "../../data/initial_data";
import { COLORS } from "../../styles/theme";
import { SIDEPANEL} from "../../styles/sidepanel";


// ─────────────────────────────── CONSTANT ─────────────────────────────── //
export const NEW_CHAT = "__NEW_CHAT__";


// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const SidePanel = ({ selected, onChange, loggedUserId, data }) => {
    const [query, setQuery] = useState("");

    const handleSelect = useCallback(
        (value) => {
            onChange?.(value);
        },
        [onChange]
    );

    // Gather unique contact IDs from messages involving the current user
    const contactIds = useMemo(() => {
        const ids = new Set();
        Object.values(data).forEach((msg) => {
            if (msg.sender_id === loggedUserId) ids.add(msg.receiver_id);
            if (msg.receiver_id === loggedUserId) ids.add(msg.sender_id);
        });
        return Array.from(ids);
    }, [loggedUserId, data]);

    // Map IDs to user objects, apply search filter, and sort by name
    const contacts = useMemo(() => {
        return contactIds
            .map((id) => initialData.users[id])
            .filter(Boolean)
            .filter((user) =>
                user.name.toLowerCase().includes(query.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [contactIds, query]);

    const renderItem = ({ item }) => {
        const isActive = selected === item.id;
        return (
            <TouchableOpacity
                style={[SIDEPANEL.item, isActive && SIDEPANEL.itemSelected]}
                onPress={() => handleSelect(item.id)}
                activeOpacity={0.6}
            >
                <View style={SIDEPANEL.avatarWrapper}>
                    <Ionicons name="person" size={24} />
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
                    value={query}
                    onChangeText={setQuery}
                />
            </View>

            {/* Contact list */}
            <FlatList
                data={contacts}
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