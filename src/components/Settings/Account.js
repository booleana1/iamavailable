import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AvatarPicker from '../AvatarPicker';
import CancelSaveButtons from "../CancelSaveButtons";
import InputField from "../InputField";
import {SETTINGS} from "../../styles/settings";
import { db } from '../../../firebase.config'
import {getDoc, doc,  updateDoc} from "firebase/firestore";
import {useUser} from "../../context/UserContext";

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const Account = () => {
    const {loggedUserId} = useUser();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [user, setUser] = useState({});
    const [feedbackMessage, setFeedbackMessage] = useState('');



    // get data
    useEffect(() => {
        const loadData = async () => {
            try{
                // get user data and set to state variable
                const userDataSnap = await getDoc(doc(db, 'users', String(loggedUserId)));
                const userData = userDataSnap.data();
                setUser(userData);

            }catch(err){
                console.log(err);
            }
        };
        loadData();
    }, [loggedUserId]);

    useEffect(() => {
        if (user.photo_url) {
            setPhotoUrl(user.photo_url);
        }
    }, [user.photo_url]);



    const handleCancel = () => {
        setName('');
        setUsername('');

        setFeedbackMessage('Changes discarded.');
        setTimeout(() => setFeedbackMessage(''), 3000);
    };


    const handleSave = async () => {
        // update user
        const updatedUser = {
            name: name.trim() || user.name,
            hashtag: username.trim() || user.hashtag,
            photo_url: photoUrl
        };

        await updateDoc(doc(db, 'users', String(loggedUserId)), updatedUser);

        setFeedbackMessage('Changes saved!');
        setTimeout(() => setFeedbackMessage(''), 3000);

    };


    return (
        <ScrollView contentContainerStyle={SETTINGS.container}>
            <Text style={SETTINGS.title}>Account</Text>
            <Text style={SETTINGS.subtitle}>Profile</Text>
            <Text style={SETTINGS.description}>
                This information will be displayed publicly so be careful what you share
            </Text>

            <View style={styles.inputContainer}>
                <View>
                    <InputField
                        label="Name"
                        placeholder={user?.name || ''}
                        value={name}
                        onChangeText={setName}
                    />
                    <InputField
                        label="Username"
                        placeholder={user?.hashtag || ''}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>


            </View>
            <View>
                <AvatarPicker
                    uri={photoUrl || null}          // current picture
                    onChange={setPhotoUrl}  // callback updates state
                    size={110}              // optional
                />
            </View>

            <CancelSaveButtons handleCancel={handleCancel} handleSave={handleSave} feedbackMessage={feedbackMessage} />

        </ScrollView>
    );
};

export default Account;

// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({
    inputContainer: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 120,
    },


});
