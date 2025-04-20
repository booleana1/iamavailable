import React, { useState, useMemo } from "react";
import {View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList} from "react-native";
import { COLORS } from "../styles/theme";
import initialData from '../data/initial_data';

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const NewChat = ({ onStart }) => {
    const [query, setQuery] = useState("");

    // compute suggestions from initialData.users
    const suggestions = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return Object.values(initialData.users)
            .filter(u =>
                u.name.toLowerCase().includes(q)
            )
            .slice(0, 5); // limit to first 5
    }, [query]);

    const handleSelect = (username) => {
        setQuery(username);
    };

    const handleStart = () => {
        if (query.trim()) {
            const user = suggestions.find(u => u.name === query);
            const id = user ? user.id : null;
            onStart(id || query);
            setQuery("");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Chat</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={'#999'}
                    value={query}
                    onChangeText={setQuery}
                />
                {suggestions.length > 0 && (
                    <View style={styles.suggestionsBox}>
                        <FlatList
                            data={suggestions}
                            keyExtractor={item => String(item.id)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.suggestionRow}
                                    onPress={() => handleSelect(item.name)}
                                >
                                    <Text style={styles.suggestionText}>{item.name}</Text>
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
    suggestionsBox: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 20,
        maxHeight: 120,
        width: '100%',
    },
    suggestionRow: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    suggestionText: {
        fontSize: 13,
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
