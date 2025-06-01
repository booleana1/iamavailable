import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {COLORS} from "./colors";


export const GLOBAL = StyleSheet.create({
    suggestionsBox: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dcdcdc',
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 20,
        maxHeight: 120,
        width: '100%',
    },
    suggestionRow: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    suggestionText: {
        fontSize: 13,
        color: COLORS.text,
    },
    avatarWrapper: {
        width: 50,
        height: 50,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatar: {
        borderWidth: 2,
        borderColor: COLORS.white,
        width: 50, height: 50,
        borderRadius: 30
    },
    avatarWrapperMsg: {
        width:40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.text,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarMsg: {
        borderWidth: 1,
        borderColor: COLORS.text,
        width: 40, height: 40,
        borderRadius: 20
    },
})
