import {StyleSheet, Text, TextInput, View} from 'react-native'
import React from 'react'
import {COLORS} from "../styles/theme";

const SettingsAccount = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account</Text>
            <Text style={styles.subtitle}>Profile</Text>
            <Text style={styles.text}>This information will be displayed publicly so be careful what you share</Text>

            <View style={styles.inputContainer}>
                <View style={styles.inputContainerLeft}>
                    <View>
                        <Text style={styles.inputText}>Name</Text>
                        <TextInput
                            placeholder="Name"
                            placeholderTextColor="#999"
                            style={styles.input}
                        />
                    </View>

                    <View>
                        <Text style={styles.inputText}>Username</Text>
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor="#999"
                            style={styles.input}
                        />
                    </View>

                </View>

                <View style={styles.inputContainerRight}>
                    <Text style={styles.inputText}>Roles</Text>
                    <TextInput
                        placeholder="Roles"
                        placeholderTextColor="#999"
                        style={styles.input}
                    />
                </View>
            </View>




        </View>
    )
}
export default SettingsAccount
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 30,
        paddingTop: 20
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        color: COLORS.text
    },
    subtitle: {
        fontSize: 22,
        color: COLORS.text,
        paddingTop: 40

    },
    text: {
        fontSize: 14,
        color: COLORS.text,
        paddingVertical: 20
    },
    inputText: {
        fontSize: 16,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingVertical: 6,
        paddingLeft: 10,
        paddingRight: 12,
        fontSize: 14,
        height: 40,
        minWidth: 20,
        maxWidth: 180,
        borderColor: '#c2c2c2',
        borderWidth: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 100
    },
    inputContainerLeft: {
        gap: 20
    },
    inputContainerRight: {},
})
