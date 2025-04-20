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
import initialData from "../data/initial_data";
import { COLORS } from "../styles/theme";

export const NEW_CHAT = "__NEW_CHAT__";

const SidePanelChat = ({ selected, onChange, loggedUserId, data }) => {
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
                style={[styles.item, isActive && styles.itemSelected]}
                onPress={() => handleSelect(item.id)}
                activeOpacity={0.6}
            >
                <View style={styles.avatarWrapper}>
                    <Ionicons name="person" size={24} />
                </View>
                <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Search bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
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
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                style={styles.list}
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

export default SidePanelChat;


const styles = StyleSheet.create({
    container: {
        width: 260,
        backgroundColor: COLORS.white,
        borderRightWidth: 1,
        borderRightColor: COLORS.border,
        paddingTop: 12,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.gray,
        marginHorizontal: 16,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
        color: COLORS.text,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 0,
        color: COLORS.text,
    },
    list: {
        flex: 1,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    itemSelected: {
        backgroundColor: COLORS.lightBlue,
    },
    avatarWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor:  COLORS.border,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        color: COLORS.text,
    },
    separator: {
        height: 1,
        backgroundColor:  COLORS.border,
        marginHorizontal: 16,
    },
    newChatContainer: {
        alignItems: "center",
        paddingVertical: 12,
    },
    newChatButton: {
        alignItems: "center",
        justifyContent: "center",
    },
});