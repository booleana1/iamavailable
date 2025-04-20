import React, {useState, useEffect} from "react";
import {View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../styles/theme";
import AvailabilityText from "./AvailabilityText";

const GroupChatView = ({group, loggedUserId, dataGroupMessages, dataAvailabilities}) => {
    const [items, setItems] = useState([]);
    const [text, setText] = useState("");

    const isOwner = group.user_id === loggedUserId;

    // Load messages and availabilities for this group
    useEffect(() => {
        const messages = Object.values(dataGroupMessages)
            .filter(m => m.group_id === group.id)
            .map(m => ({...m, type: "message"}));

        const availabilities = Object.values(dataAvailabilities)
            .filter(av => av.group_id === group.id)
            .map(av => ({
                ...av,
                type: "availability",
            }));

        const combined = [...messages, ...availabilities]
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        setItems(combined);

    }, [group, dataGroupMessages, dataAvailabilities]);


    // Send a text message
    const handleSendMessage = () => {
        if (!text.trim()) return;
        const newMsg = {
            id: Date.now(),
            sender_id: loggedUserId,
            receiver_id: null,
            group_id: group.id,
            content: text.trim(),
            createdAt: new Date().toISOString(),
            type: "message"
        };
        setItems(prev => [...prev, newMsg]);
        setText("");
    };

    //
    const handleNewAvailability = () => {
        alert("Create new availability");
    };

    // Render each item based on its type
    const renderItem = ({item}) => {
        if (item.type === "message") {
            const isOutgoing = item.sender_id === loggedUserId;
            return (
                <View style={isOutgoing ? styles.outgoing : styles.incoming}>
                    <Text style={isOutgoing ? styles.textOutgoing : styles.textIncoming}>
                        {item.content}
                    </Text>
                </View>
            );
        }

        // Availability item
        const bubbleStyle = isOwner ? styles.outgoingAvailability : styles.incomingAvailability;
        return (
            <View style={bubbleStyle}>
                <AvailabilityText
                    name={item.name}
                    date={item.start_date.slice(0, 10).split("-").reverse().join("/")}
                    time={item.start_date.slice(11, 16)}
                    yesCount={item.yesCount}
                    noCount={item.noCount}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {isOwner &&
                <View style={styles.groupHeader}>
                    <Text style={styles.title}>{group.name}</Text>
                    <TouchableOpacity style={styles.iconHeader} onPress={() => {
                        alert("Group settings")
                    }}>
                        <Ionicons name={"settings-outline"} size={30}/>
                    </TouchableOpacity>

                </View>
            }
            {!isOwner &&
                <View style={styles.groupHeader}>
                    <Text style={styles.title}>{group.name}</Text>
                    <TouchableOpacity style={styles.iconHeader} onPress={() => {
                        alert("Group members")
                    }}>
                        <Ionicons name={"people-outline"} size={30}/>
                    </TouchableOpacity>

                </View>
            }
            <View style={styles.content}>
                <FlatList
                    data={items}
                    keyExtractor={item => `${item.type}-${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />

                {isOwner && <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={handleNewAvailability} style={styles.iconButton}>
                        <Ionicons name="add-circle-outline" size={36} color={COLORS.primary}/>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                        placeholder="Write your message"
                    />
                    <TouchableOpacity onPress={handleSendMessage} style={styles.iconButton}>
                        <Ionicons name="send-outline" size={28} color={COLORS.primary}/>
                    </TouchableOpacity>
                </View>}
                {!isOwner && <View style={styles.inputContainer}>
                    <View style={[styles.input, {alignItems: "center", justifyContent: "center"}]}>
                        <Text style={{color: "#777"}}>Only the administrator can write in this group</Text>
                    </View>
                </View>}
            </View>


        </View>
    );
};

export default GroupChatView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 8,
    },
    groupHeader: {
        flexDirection: "row",
        justifyContent: "center",
        position: "relative",
        borderBottomWidth:1,
        borderBottomColor: COLORS.text,
        paddingBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
    },
    iconHeader: {
        position: "absolute",
        right: 16,
    },
    content: {
        flex: 1,
        padding: 15
    },
    list: {
        padding: 16
    },
    incoming: {
        alignSelf: "flex-start",
        backgroundColor: COLORS.primary,
        borderRadius: 30,
        marginVertical: 4,
        padding: 12,
        paddingHorizontal: 20,
        maxWidth: "80%"
    },
    outgoing: {
        alignSelf: "flex-end",
        backgroundColor: COLORS.primary,
        borderRadius: 30,
        marginVertical: 4,
        padding: 12,
        paddingHorizontal: 20,
        maxWidth: "80%"
    },
    incomingAvailability: {
        alignSelf: "flex-start",
        marginVertical: 4,
        maxWidth: "80%"
    },
    outgoingAvailability: {
        alignSelf: "flex-end",
        marginVertical: 4,
        maxWidth: "80%"
    },
    textIncoming: {
        color: COLORS.white,
        fontSize: 14
    },
    textOutgoing: {
        color: COLORS.white,
        fontSize: 14
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        width: "80%",
        alignSelf: "center",
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 16,
        backgroundColor: COLORS.gray,
        color: COLORS.text,
    },
    iconButton: {
        marginLeft: 8,
        padding: 4
    }
});