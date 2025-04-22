import {StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../styles/theme";

const IconPressButton = ({icon, color, size,styleIcon={}, styleTouchable={},onPress}) => {
    return (
        <>
            <TouchableOpacity style={styleTouchable} onPress={onPress}>
                <Ionicons name={icon} size={size} style={[styleIcon,{color}]}/>
            </TouchableOpacity>
        </>
    )

}
export default IconPressButton
