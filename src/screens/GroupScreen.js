import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import SidePanelGroups from "../components/SidePanelGroups";
import MyGroupView from "../components/MyGroupView";
import initialData from "../data/initial_data";
import EmptyState from "../components/EmptyState";

const GroupsScreen = ({ loggedUserId,  dataGroupMessages, dataAvailabilities, dataGroups, dataGroupUsers }) => {
    const [selected, setSelected] = useState(null);

    let content;
    if (selected) {
        const group = initialData.groups[selected];
        content = (
            <MyGroupView
                group={group}
                loggedUserId={loggedUserId}
                dataGroupMessages={dataGroupMessages}
                dataAvailabilities={dataAvailabilities}
            />
        );
    } else {
        content = (
            <EmptyState/>
        );
    }

    return (
        <View style={styles.container}>
            <SidePanelGroups
                selected={selected}
                onChange={setSelected}
                loggedUserId={loggedUserId}
                dataGroups={dataGroups}
                dataGroupUsers={dataGroupUsers}
            />
            <View style={styles.content}>{content}</View>
        </View>
    );
};

export default GroupsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: "row" },
    content: { flex: 1, backgroundColor: "#f5f5f5" },
    empty: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { color: "#888", fontSize: 16 }
});
