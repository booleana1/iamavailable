import React, {useState, useEffect, useCallback} from "react";
import { View, TextInput, SectionList, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../styles/theme";

const SidePanelGroups = ({ selected, onChange, loggedUserId, dataGroups, dataGroupUsers}) => {
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
        const myData = Object.values(dataGroups)
                                    .filter((group) =>
                                        group.user_id === loggedUserId
                                    )
                                    .map((group) => {
                                        return {
                                            id: group.id,
                                            name: group.name,
                                        }
                                    })

        // groups user is a member
        const otherData = Object.values(dataGroupUsers)
            .filter((group) =>
                group.user_id === loggedUserId &&
                group.status === "approved"
            )
            .map((group) => {
                return {
                    id: group.group_id,
                    name: Object.values(dataGroups)
                        .filter((g) => g.id === group.group_id)
                        .map((gr) => gr.name),
                }
            })
        setMyGroups(myData);
        setOtherGroups(otherData);
    }, [loggedUserId,dataGroups,dataGroupUsers]);


    // render group icon and name
    const renderItem = ({ item }) => {
        const isActive = selected === item.id;
        return (
            <TouchableOpacity
                style={[styles.item, isActive && styles.itemSelected]}
                onPress={() => handleSelect(item.id)}
                activeOpacity={0.6}
            >
                {/*TODO: when doing backend put group avatar here*/}
                <View style={styles.avatarWrapper}>
                    <Ionicons name="people" size={24} />
                </View>
                <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    // define sections
    const sections = [
        { title: "My Groups", data: myGroups },
        { title: "Other Groups", data: otherGroups },
    ];

    // render section header
    const renderSectionHeader = ({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    return (
        <View style={styles.container}>
            {/* Search bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
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
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                style={styles.list}
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

export default SidePanelGroups;

const styles = StyleSheet.create({
    container: {
        width: 260,
        height: '100%',
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
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.text,
        backgroundColor: COLORS.background,
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
        borderColor: COLORS.border,
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
        backgroundColor: COLORS.border,
        marginHorizontal: 16,
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