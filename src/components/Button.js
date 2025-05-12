import {Text, TouchableOpacity} from 'react-native'
import React from 'react'

const Button = ({text,stylesButton,stylesButtonText, handle}) => {
    return (
        <TouchableOpacity style={stylesButton} onPress={handle}>
            <Text style={stylesButtonText}>{text}</Text>
        </TouchableOpacity>
    )
}
export default Button
