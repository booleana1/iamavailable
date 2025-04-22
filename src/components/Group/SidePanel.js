
// ─────────────────────────────── IMPORTS ─────────────────────────────── //
import React, {useState, useEffect, useCallback, useMemo} from "react";
import { View, TextInput, SectionList, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../styles/theme";
import {SIDEPANEL} from "../../styles/sidepanel";


// ─────────────────────────────── UTILS ─────────────────────────────── //
const getUserOwnedGroups = (groups, userId) => {
    return Object.values(groups)
        .filter((group) => group.user_id === userId)
        .map((group) => ({
            id: group.id,
            name: group.name,
        }));
};

const getUserMemberGroups = (groups, groupUsers, userId) => {
    return Object.values(groupUsers)
        .filter((gu) => gu.user_id === userId && gu.status === "approved")
        .map((gu) => {
            const group = groups[gu.group_id] || Object.values(groups).find(g => g.id === gu.group_id);
            return group ? { id: group.id, name: group.name } : null;
        })
        .filter(Boolean);
};

const filterGroups = (groups, query) => {
    return groups
        .filter((g) =>
            g.name?.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));
};


// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const SidePanel = ({ selected, onChange, loggedUserId, dataGroups, dataGroupUsers}) => {
    const [query, setQuery] = useState("");
    const [myGroups, setMyGroups] = useState([]);
    const [otherGroups, setOtherGroups] = useState([]);

    // handle when user select a group to see the chat
    const handleSelect = useCallback(
        (value) => {
            onChange?.(value);
        },
        [onChange]
    );

    // Get groups the user is in, wither by being main actor, or secondary actor
    useEffect(() => {
        // groups the user owns
        const myData = getUserOwnedGroups(dataGroups,loggedUserId);

        // groups user is a member
        const otherData = getUserMemberGroups(dataGroups,dataGroupUsers,loggedUserId);

        setMyGroups(myData);
        setOtherGroups(otherData);

    }, [loggedUserId,dataGroups,dataGroupUsers]);

    // Apply search filter, and sort by name
    const filteredMyGroups = useMemo(() => {
        return filterGroups(myGroups,query);
    }, [myGroups, query]);

    const filteredOtherGroups = useMemo(() => {
        return filterGroups(otherGroups,query);
    }, [otherGroups, query]);

    // render group icon and name
    const renderItem = ({ item }) => {
        const isActive = selected === item.id;
        return (
            <TouchableOpacity
                style={[SIDEPANEL.item, isActive && SIDEPANEL.itemSelected]}
                onPress={() => handleSelect(item.id)}
                activeOpacity={0.6}
            >
                {/*TODO: when doing backend put group avatar here*/}
                <View style={SIDEPANEL.avatarWrapper}>
                    <Ionicons name="people" size={24} />
                </View>
                <Text style={SIDEPANEL.name}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    // define sections
    const sections = [
        { title: "My Groups", data: filteredMyGroups },
        { title: "Other Groups", data: filteredOtherGroups },
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
                    value={query}
                    onChangeText={setQuery}
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
                    onPress={() => alert("Create new group")}
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