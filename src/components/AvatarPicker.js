import React, { useState } from 'react';
import {Image, Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../styles/theme';

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const AvatarPicker = ({ uri, onChange, size = 100 }) => {
    const [photoUri, setPhotoUri] = useState(uri);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access the gallery is required');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            const selectedUri = result.assets[0].uri;
            setPhotoUri(selectedUri);
            onChange?.(selectedUri);            // callback for parent
        }
    };

    const removeImage = () => {
        setPhotoUri(null);
        onChange?.(null);
    };


    return (
        <TouchableOpacity onPress={pickImage} style={styles.wrapper}>
            <Image
                source={{ uri: photoUri }}
                style={[
                    styles.avatar,
                    { width: size, height: size, borderRadius: size / 2 },
                ]}
            />
            <View style={styles.actions}>
                <TouchableOpacity onPress={pickImage}>
                    <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
                {photoUri && (
                    <TouchableOpacity onPress={removeImage}>
                        <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default AvatarPicker;

// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,

    },
    avatar: {
        borderWidth: 2,
        borderColor: COLORS.text,
    },
    changeText: {
        marginLeft: 30,
        fontSize: 16,
        color: COLORS.text,
        borderColor: COLORS.gray,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    removeText: {
        fontSize: 16,
        color: COLORS.danger,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40
    },
});
