import React, {useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {COLORS} from "../styles/theme";
import {Ionicons} from "@expo/vector-icons";


const AvailabilityText = ({name, date, time}) => {
    const [yesCount, setYesCount] = useState(0);
    const [noCount, setNoCount] = useState(0);


    return (
        <View style={styles.container}>
            <View style={styles.availability}>
                <Text style={styles.title}>{name}</Text>
                <View style={styles.body}>
                    <View>
                        <Text style={styles.detail}>Date → {date}</Text>
                        <Text style={styles.detail}>Hour → {time}</Text>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => alert("Availability details")}>
                            <Text style={styles.buttonText}>View details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {/*TODO: do a better "yes/no" count where a user can only vote once*/}
            <View style={styles.statsRow}>
                {yesCount}
                <TouchableOpacity onPress={() => setYesCount((count) => count + 1)}>
                    <Ionicons style={styles.buttonYesCount} name={"checkmark"}/>
                </TouchableOpacity>
                {noCount}
                <TouchableOpacity  onPress={() => setNoCount((count) => count + 1)}>
                    <Ionicons style={styles.buttonNoCount} name={"close"}/>
                </TouchableOpacity>

            </View>
        </View>
    );
};

export default AvailabilityText;

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        gap: 5,

    },
    availability: {
        padding: 25,
        backgroundColor: COLORS.primary,
        borderRadius: 20
    },
    body: {
        flexDirection: "row",
        gap: 15
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.white,
        marginBottom: 8,
    },
    detail: {
        fontSize: 14,
        color: COLORS.white
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 10

    },
    button: {
        backgroundColor: COLORS.gray,
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: '600'
    },
    buttonYesCount: {
        color: COLORS.success,
        fontSize: 24,
    },
    buttonNoCount: {
        color: COLORS.danger,
        fontSize: 24,
    },
});
