import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {COLORS} from "../styles/colors";
import Button from "./Button";

const CancelSaveButtons = ({handleCancel, handleSave}) => {
    return (
        <View style={styles.bottomContainer}>
            <View style={styles.line}></View>

            <View style={styles.buttonRow}>
                <Button text={"Cancel"}
                        stylesButton={styles.cancelButton}
                        stylesButtonText={styles.cancelButtonText}
                        handle={handleCancel}
                />
                <Button text={"Save"}
                        stylesButton={styles.saveButton}
                        stylesButtonText={styles.saveButtonText}
                        handle={handleSave}
                />
            </View>
        </View>
    )
}
export default CancelSaveButtons
const styles = StyleSheet.create({
    bottomContainer: {
        width: '60%',
        marginTop: 40,
        alignItems: 'flex-end',
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: COLORS.gray,
    },
    buttonRow: {
        width: '40%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        marginTop: 40,
    },
    cancelButton: {
        flex: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        borderWidth: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600'
    },
    saveButton: {
        flex: 1,
        backgroundColor: COLORS.success,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
})
