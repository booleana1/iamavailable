
import React, {useState, useEffect, useCallback, useMemo} from "react";
import { View, TextInput, SectionList, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {COLORS, GLOBAL} from "../../styles/theme";
import {SIDEPANEL} from "../../styles/sidepanel";
import {app, db, auth} from '../../../firebase.config'
import {collection,  query, where, onSnapshot, doc, getDocs, documentId, orderBy} from "firebase/firestore";
import {useNavigation} from "@react-navigation/native";
import {useUser} from "../../context/UserContext";

export const NEW_GROUP = "__NEW_GROUP__";


// ─────────────────────────────── UTILS ─────────────────────────────── //

const filterGroups = (groups, q) => {
    return groups
        .filter((g) =>
            g.name?.toLowerCase().includes(q.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));
};

const makeChunks = (arr, size = 10) => {
    const unique = [...new Set(
        arr
            .filter(id => id != null)
            .map(id => String(id))
    )];

    const chunks = [];
    for (let i = 0; i < unique.length; i += size) {
        chunks.push(unique.slice(i, i + size));
    }
    return chunks;
};

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const SidePanel = () => {
    const navigation = useNavigation();
    const {loggedUserId} = useUser();

    const [queryText, setQueryText] = useState("");
    const [myGroups, setMyGroups] = useState([]);
    const [otherGroups, setOtherGroups] = useState([]);
    const [selected, setSelected] = useState(null);


    // Get groups the user is in, wither by being main actor, or secondary actor
    useEffect(() => {
        if(!loggedUserId) return;
        // groups the user owns
        const q = query(
            collection(db,"groups"),
            where("user_id", "==", loggedUserId)
        )

        const unsubscribe = onSnapshot(q, qSnap => {
            const groups = qSnap.docs.map(d => ({
                id:   d.id,
                name: d.data().name,
                ownerId: loggedUserId,
            }));
            setMyGroups(groups);
        }, err => console.error(err));

        return () => unsubscribe();
    }, [loggedUserId]);

    // get groups user are not owner (secondary actor)
    useEffect(() => {
        if (!loggedUserId) return;

        const qq = query(
            collection(db, 'group_users'),
            where('user_id', '==', loggedUserId),
            where('status',  '==', 'approved')
        );

        const unsub = onSnapshot(qq, async snap => {
            const groupIds = snap.docs.map(d => d.data().group_id);
            if (groupIds.length === 0) { setOtherGroups([]); return; }

            const chunks = makeChunks(groupIds, 10);
            const promises = chunks
                .filter(ids => ids.length)
                .map(ids =>
                    getDocs(
                        query(
                            collection(db, 'groups'),
                            where(documentId(), 'in', ids)
                        )
                    )
                );

            const snaps = await Promise.all(promises);
            const groups = snaps
                .flatMap(s => s.docs)
                .map(d => ({ id: d.id, name: d.data().name, ownerId: d.data().user_id }))
                .filter(g => g.ownerId !== loggedUserId);

            setOtherGroups(groups);
        });

        return () => unsub();
    }, [loggedUserId]);


    // Apply search filter, and sort by name
    const filteredMyGroups = useMemo(() => {
        return filterGroups(myGroups ?? [],queryText);
    }, [myGroups, queryText]);

    const filteredOtherGroups = useMemo(() => {
        return filterGroups(otherGroups ?? [],queryText);
    }, [otherGroups, queryText]);

    // handle when user select a group to see the chat
    const handleSelect = useCallback(
        (item) => {
            setSelected(item);

            if (item === NEW_GROUP) {
                navigation.navigate('CreateChat');
            } else {
                console.log(item)
                navigation.navigate('Groups', { screen: 'GroupWindow', params: { group: item } });
            }
        },
        [navigation]
    );

    // render group icon and name
    const renderItem = ({ item }) => {
        const isActive = selected === item;

        return (
            <TouchableOpacity
                style={[SIDEPANEL.item, isActive && SIDEPANEL.itemSelected]}
                onPress={() => handleSelect(item)} // chat id
                activeOpacity={0.6}
            >
                <View style={GLOBAL.avatarWrapperMsg}>
                    {item.photo_url && item.photo_url.startsWith('data:image') ? (
                        <Image
                            source={{ uri: item.photo_url }}
                            style={GLOBAL.avatarMsg}
                        />
                    ) : (
                        <Ionicons name="people" size={24} color="#000" />
                    )}
                </View>
                <Text style={SIDEPANEL.name}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    // define sections
    const sections = [
        { title: "My Groups", data: filteredMyGroups ?? [] },
        { title: "Other Groups", data: filteredOtherGroups ?? [] },
    ];

    // render section header
    const renderSectionHeader = ({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    return (
        <View style={SIDEPANEL.container}>
            {/* Search bar */}
            <View style={SIDEPANEL.searchContainer}>
                <Ionicons name="search" size={18} style={SIDEPANEL.searchIcon} />
                <TextInput
                    style={SIDEPANEL.searchInput}
                    placeholder="Search groups"
                    value={queryText}
                    onChangeText={setQueryText}
                />
            </View>

            {/* Sectioned group list */}
            <SectionList
                sections={sections}
                keyExtractor={(item) => String(item.id)}
                renderSectionHeader={renderSectionHeader}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={SIDEPANEL.separator} />}
                showsVerticalScrollIndicator={false}
                style={SIDEPANEL.list}
            />
            {/* New group button */}
            <View style={styles.newGroupContainer}>
                <TouchableOpacity
                    onPress={() => handleSelect(NEW_GROUP)}
                    style={styles.newGroupButton}
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
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.text,
        backgroundColor: COLORS.background,
    },
    newGroupContainer: {
        alignItems: "center",
        paddingVertical: 12,
    },
    newGroupButton: {
        alignItems: "center",
        justifyContent: "center",
    },

});