import React from "react";
import { Image, StyleSheet, View } from "react-native";

const EmptyState = () => (
    <View style={styles.container}>
        <Image
            source={require("../assets/favicon.jpeg")}
        >
        </Image>
    </View>

);

export default EmptyState;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
    },
});