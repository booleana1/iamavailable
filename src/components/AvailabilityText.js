// ─────────────────────────────── IMPORTS ─────────────────────────────── //
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../styles/theme";
import IconPressButton from "./IconPressButton";

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const AvailabilityText = ({ name, date, time }) => {
    const [yesCount, setYesCount] = useState(0);
    const [noCount, setNoCount] = useState(0);
    const [userVoted, setUserVoted] = useState("");

    const updateVote = useCallback((voteType) => {
        if (voteType === userVoted) return;

        if (voteType === "Yes") {
            if (userVoted === "No") setNoCount((c) => c - 1);
            setYesCount((c) => c + 1);
        }

        if (voteType === "No") {
            if (userVoted === "Yes") setYesCount((c) => c - 1);
            setNoCount((c) => c + 1);
        }

        setUserVoted(voteType);
    }, [userVoted]);

    return (
        <View style={styles.container}>
            {/* AVAILABILITY */}
            <View style={styles.availability}>
                <Text style={styles.title}>{name}</Text>
                <View style={styles.body}>
                    <View>
                        <Text style={styles.detail}>Date → {date}</Text>
                        <Text style={styles.detail}>Hour → {time}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => alert("Availability details")}
                    >
                        <Text style={styles.buttonText}>View details</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* VOTING */}
            <View style={styles.statsRow}>
                <Text>{yesCount}</Text>
                <IconPressButton
                    count={yesCount}
                    icon="checkmark"
                    color={COLORS.success}
                    size={24}
                    onPress={() => updateVote("Yes")}
                />
                <Text>{noCount}</Text>
                <IconPressButton
                    count={noCount}
                    icon="close"
                    color={COLORS.danger}
                    size={24}
                    onPress={() => updateVote("No")}
                />
            </View>
        </View>
    );
};

export default AvailabilityText;


// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: 5,
    },
    availability: {
        padding: 25,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
    },
    body: {
        flexDirection: "row",
        gap: 15,
        justifyContent: "space-between",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.white,
        marginBottom: 8,
    },
    detail: {
        fontSize: 14,
        color: COLORS.white,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 10,
    },
    button: {
        backgroundColor: COLORS.gray,
        borderRadius: 8,
        padding: 8,
        alignItems: "center",
    },
    buttonText: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: "600",
    },
});
