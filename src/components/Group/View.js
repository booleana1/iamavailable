import React, {useState, useEffect, useRef} from "react";
import {View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../../styles/theme";
import AvailabilityText from "./AvailabilityText";
import IconPressButton from "../IconPressButton";
import {CHAT} from "../../styles/chat";
import {app, db, auth} from '../../../firebase.config'
import {collection, query, doc, where, writeBatch, onSnapshot, getDoc, setDoc, updateDoc, increment} from "firebase/firestore";


// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const GroupChatView = ({group, loggedUserId}) => {
    const [items, setItems] = useState([]);
    const [messages, setMessages] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [text, setText] = useState("");
    const isOwner = loggedUserId === group.ownerId;
    // allows auto scrolling to last msg sent
    const flatListRef = useRef(null);


    // get messages and availabilities for this group
    useEffect(() => {
        if (!group || !group.id) return;

        const messageQuery = query(
            collection(db, 'groups', group.id, 'messages'),
        );

        const unsub = onSnapshot(messageQuery, (snapshot) => {
            const messageData = snapshot.docs
                .map(doc => ({
                    id:doc.id,
                    ...doc.data(),
                    type: 'message'
                }));

            setMessages(messageData);
        });
        return () => {
            setMessages([]);
            unsub();
        };
    }, [group]);

    // get availabilities
    useEffect(() => {
        if (!group || !group.id) return;

        const availQuery = query(
            collection(db, 'availabilities'),
            where('group_id', '==', Number(group.id))
        );

        const unsub = onSnapshot(availQuery, (snapshot) => {
            const availData = snapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                start_date: doc.data().start_date,
                created_at: doc.data().created_at,
                yesCount: doc.data().yes_count || 0,
                noCount: doc.data().no_count || 0,
                type: 'availability'
            }));
            setAvailabilities(availData);
        });

        return () => {
            setAvailabilities([]);
            unsub();
        };
    }, [group]);

    useEffect(() => {
        const combined = [...messages, ...availabilities]
            .filter(Boolean)
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setItems(combined);
    }, [messages, availabilities]);
    // Send a text message
    const handleSendMessage = async () => {
        const cleanText = text.trim();
        if (!cleanText) return;

        const newMsg = {
            sender_id: loggedUserId,
            group_id: group.id,
            content: cleanText,
            created_at: new Date().toISOString().replace('Z', '')
        };

        // refs
        const groupRef = doc(db, 'groups', group.id);
        const itemRef  = doc(collection(groupRef, 'messages'));

        // batch
        const batch = writeBatch(db);
        batch.set(itemRef, newMsg);
        batch.update(groupRef, { updatedAt: new Date().toISOString().replace('Z', '')});

        await batch.commit();

        setText("");
    };

    //
    const handleNewAvailability = () => {
        alert("Create new availability");
        // TODO: in last assignment call availability create
    };

    // handle vote
    const voteOnAvailability = async (availabilityId, voteType) => {
        if (voteType !== "yes" && voteType !== "no") return;
        const voteRef = doc(db, 'availabilities', availabilityId, 'votes', String(loggedUserId));
        const voteSnap = await getDoc(voteRef);
        const availabilityRef = doc(db, 'availabilities', availabilityId);

        if (voteSnap.exists()) {
            const previousVote = voteSnap.data().vote;
            if (previousVote === voteType) {
                return;
            }
            // change vote
            await setDoc(voteRef, { vote: voteType });
            await updateDoc(availabilityRef, {
                [`${previousVote}_count`]: increment(-1),
                [`${voteType}_count`]: increment(1)
            });
        } else {
            await setDoc(voteRef, { vote: voteType });
            await updateDoc(availabilityRef, {
                [`${voteType}_count`]: increment(1)
            });
        }
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
        const bubbleStyle = isOwner? styles.outgoingAvailability : styles.incomingAvailability;
        return (
            <View style={bubbleStyle}>
                <AvailabilityText
                    name={item.name}
                    date={
                        item.start_date
                            ? item.start_date.slice(0, 10).split("-").reverse().join("/")
                            : "??/??/????"
                    }
                    time={
                        item.start_date
                            ? item.start_date.slice(11, 16)
                            : "--:--"
                    }
                    availabilityId={item.id}
                    yesCount={item.yesCount}
                    noCount={item.noCount}
                    onVote={voteOnAvailability}
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
                    ref={flatListRef}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
                        onSubmitEditing={handleSendMessage}
                        blurOnSubmit={false}
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