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
})
