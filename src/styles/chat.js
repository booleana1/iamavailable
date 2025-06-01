import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {COLORS} from "./colors";

export const CHAT = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    incoming: {
        alignSelf: "flex-start",
        borderRadius: 30,
        marginVertical: 4,
        padding: 12,
        paddingHorizontal: 20,
        maxWidth: "80%"
    },
    outgoing: {
        alignSelf: "flex-end",
        backgroundColor: COLORS.primary,
        borderRadius: 30,
        marginVertical: 4,
        padding: 12,
        paddingHorizontal: 20,
        maxWidth: "80%"
    },
    messageTextIncoming: {
        color: COLORS.text,
        fontSize: 14
    },
    messageTextOutgoing: {
        color: COLORS.white,
        fontSize: 14
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 18,
        backgroundColor: COLORS.gray,
        color: COLORS.text,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        alignSelf: "center",
        width: "80%",
    },
    sendButton: {
        marginLeft: 8,
        padding: 4
    }
})
