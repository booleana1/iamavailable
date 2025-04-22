import {StyleSheet, Text, TextInput, View} from 'react-native'
import React from 'react'

const InputField = ({label, placeholder, value, onChangeText, onSubmitEditing,secureTextEntry}) => {
    return (
        <View style={styles.field}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#999"
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
                returnKeyType="done"
                secureTextEntry={secureTextEntry}
            />
        </View>
    )
}
export default InputField
const styles = StyleSheet.create({
    field: {
        marginBottom: 20
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 6
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 14,
        height: 40,
        borderColor: '#c2c2c2',
        borderWidth: 1,
    },
})
