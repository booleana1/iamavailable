import {TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Ionicons} from "@expo/vector-icons";

const IconPressButton = ({icon, color, size,styleIcon={}, styleTouchable={},onPress}) => {
    return (
        <View>
            <TouchableOpacity style={styleTouchable} onPress={onPress}>
                <Ionicons name={icon} size={size} style={[styleIcon,{color}]}/>
            </TouchableOpacity>
        </View>
    )

}
export default IconPressButton
