import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SidePanel from "../components/Group/SidePanel";
import MyGroupView from "../components/Group/View";
import EmptyState from "../components/EmptyState";

const GroupsScreen = ({ loggedUserId }) => {
    const [selected, setSelected] = useState(null);

    const renderContent = () => {
        if (selected) {
            return <MyGroupView
                group={selected}
                loggedUserId={loggedUserId}
            />

        } else {
            return <EmptyState/>
        }
    }
    return (
        <View style={styles.container}>
            <SidePanel
                selected={selected}
                onChange={setSelected}
                loggedUserId={loggedUserId}
            />
            <View style={styles.content}>{renderContent()}</View>
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
