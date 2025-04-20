import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {COLORS} from "../styles/colors";

const Button = ({text,stylesButton,stylesButtonText, handle}) => {
    return (
        <TouchableOpacity style={stylesButton} onPress={handle}>
            <Text style={stylesButtonText}>{text}</Text>
        </TouchableOpacity>
    )
}
export default Button
const styles = StyleSheet.create({})
