import React, {useState, useEffect} from "react";
import {View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../../styles/theme";
import AvailabilityText from "./AvailabilityText";
import IconPressButton from "../IconPressButton";
import {CHAT} from "../../styles/chat";

// ─────────────────────────────── UTILS ─────────────────────────────── //
const getGroupMessages = (data, group) => {
    return Object.values(data)
        .filter(m => m.group_id === group.id)
        .map(m => ({...m, type: "message"}));
}

const getGroupAvailability = (data, group) => {
    return Object.values(data)
        .filter(av => av.group_id === group.id)
        .map(av => ({
            ...av,
            type: "availability",
        }));
}

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const GroupChatView = ({group, loggedUserId, dataGroupMessages, dataAvailabilities}) => {
    const [items, setItems] = useState([]);
    const [text, setText] = useState("");

    const isOwner = group.user_id === loggedUserId;

    // Load messages and availabilities for this group
    useEffect(() => {
        const messages = getGroupMessages(dataGroupMessages, group);

        const availabilities = getGroupAvailability(dataAvailabilities, group);

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
                <View style={isOutgoing ? CHAT.outgoing : [CHAT.incoming,styles.incoming]}>
                    <Text style={isOutgoing ? CHAT.messageTextOutgoing : [CHAT.messageTextIncoming, {color: COLORS.white}]}>
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
                />
            </View>
        );
    };

    return (
        <View style={[CHAT.container, styles.container]}>
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

                    <IconPressButton
                        styleTouchable={styles.iconHeader}
                        onPress={() => {
                            alert("Group members")
                        }}
                        icon={"people-outline"}
                        size={30}
                        color={COLORS.text}
                    />

                </View>
            }
            <View style={styles.content}>
                <FlatList
                    data={items}
                    keyExtractor={item => `${item.type}-${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />

                {isOwner && <View style={CHAT.inputContainer}>

                    <IconPressButton
                        styleTouchable={CHAT.sendButton}
                        onPress={handleNewAvailability}
                        icon={"add-circle-outline"}
                        size={36}
                        color={COLORS.primary}
                    />
                    <TextInput
                        style={CHAT.input}
                        value={text}
                        onChangeText={setText}
                        placeholder="Write your message"
                    />
                    <IconPressButton styleTouchable={CHAT.sendButton} onPress={handleSendMessage}
                                     icon={"send-outline"} size={28} color={COLORS.primary}/>
                </View>}
                {!isOwner && <View style={CHAT.inputContainer}>
                    <View style={[CHAT.input, {alignItems: "center", justifyContent: "center"}]}>
                        <Text style={{color: "#777"}}>Only the administrator can write in this group</Text>
                    </View>
                </View>}
            </View>


        </View>
    );
};

export default GroupChatView;

// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({
    container: {
        padding: 8,
    },
    groupHeader: {
        flexDirection: "row",
        justifyContent: "center",
        position: "relative",
        borderBottomWidth: 1,
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
    incoming:{
        backgroundColor: COLORS.primary,
    }


});