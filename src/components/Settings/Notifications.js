import React, {useState, useMemo, useEffect} from 'react';
import {StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Switch,} from 'react-native';
import CancelSaveButtons from "../CancelSaveButtons";
import {GLOBAL, SETTINGS, COLORS} from "../../styles/theme";

import { doc, setDoc, getDoc, getDocs,collection } from "firebase/firestore";
import {app, db, auth} from '../../../firebase.config'

// ─────────────────────────────── CONSTANT ─────────────────────────────── //
const CATEGORY_KEYS = ['groups', 'roles', 'users'];

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const Notifications = ({ loggedUserId }) => {
    const [preferences, setPreferences] = useState({groups: [],roles: [],users: []});
    const [allGroups, setAllGroups] = useState([]);
    const [allRoles, setAllRoles] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [formState, setFormState] = useState({groups: [],roles: [],users: []});
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const [inputs, setInputs] = useState({ groups: '', roles: '', users: '' });

    // get all data needed to suggestions -> id and name from groups, roles and users
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [groupsSnap, rolesSnap, usersSnap] = await Promise.all([
                    getDocs(collection(db, 'groups')),
                    getDocs(collection(db, 'roles')),
                    getDocs(collection(db, 'users')),
                ]);

                setAllGroups(groupsSnap.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name
                })));

                setAllRoles(rolesSnap.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().role_name
                })));

                setAllUsers(usersSnap.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name
                })));
            } catch (err) {
                console.log( err);
            }
        };
        fetchAllData();
    }, []);

    // get user notifications preferences
    useEffect(() => {
        const fetchPrefs = async () => {
            try {
                const prefsCol = collection(db, 'users', String(loggedUserId), 'notification_preferences');
                const prefsSnap = await getDocs(prefsCol);

                const prefs = { groups: [], roles: [], users: [] };

                // saving each id in each category key
                prefsSnap.forEach(docSnap => {
                    const key = docSnap.id;
                    const data = docSnap.data();

                    if (prefs.hasOwnProperty(key) && Array.isArray(data.ids)) {
                        prefs[key] = data.ids;
                    }
                });

                setPreferences(prefs);
            } catch (err) {
                console.log(err);
            }
        };
        fetchPrefs();
    }, [loggedUserId]);

    const allItems = useMemo(() => {
        //build all items -> this will be set in formState, and the formState will be used for the search
        // it already activate the ids in preferences
            const build = (list, activeIds) =>
                list.map(obj => ({
                    id: obj.id,
                    name: obj.name,
                    active: activeIds.includes(obj.id),
                    wasActive: activeIds.includes(obj.id),
                    touched: false,
                }));

        return {
            groups: build(allGroups,preferences["groups"]),
            roles: build(allRoles,preferences["roles"]),
            users: build(allUsers,preferences["users"]),
        };
    }, [allGroups, allRoles, allUsers, preferences]);

    useEffect(() => {
        // set all items data to formState
        setFormState(allItems);

    }, [allItems]);

    // activate and deactivate toggle item
    const toggleItem = (category, id, forceActive = null) => {
        setFormState(prev => ({
            ...prev,
            [category]: prev[category].map(item =>
                item.id === id
                    ? {
                        ...item,
                        active: forceActive ?? !item.active,
                        touched: true,
                    }
                    : item,
            ),
        }));
    };

    const handleCancel = () => {
        setFormState(allItems);

        setFeedbackMessage('Changes discarded.');
        setTimeout(() => setFeedbackMessage(''), 3000);
    };

    const handleSave = async () => {
        // filter only active ids
        const subscriptionUpdate = CATEGORY_KEYS.reduce((subs, cat) => {
            subs[cat] = formState[cat]
                .filter(item => item.active)
                .map(item => item.id);
            return subs;
        }, {});

        try {
            const userPrefsCol = collection(db, 'users', String(loggedUserId), 'notification_preferences');

            // update each cat
            for (const cat of CATEGORY_KEYS) {
                const docRef = doc(userPrefsCol, cat);
                await setDoc(docRef, { ids: subscriptionUpdate[cat] });
            }

            // update (wasActive / touched)
            setFormState(prev =>
                CATEGORY_KEYS.reduce((acc, cat) => {
                    acc[cat] = prev[cat].map(i => ({
                        ...i,
                        wasActive: i.active,
                        touched: false,
                    }));
                    return acc;
                }, {})
            );
            // update prefs
            setPreferences(subscriptionUpdate);

            setFeedbackMessage('Changes saved!');
            setTimeout(() => setFeedbackMessage(''), 3000);
        } catch (err) {
            console.log(err);
        }
    };

    const getSuggestions = (category, querySuggestion) => {
        if (!querySuggestion || !formState[category]) return [];
        const q = querySuggestion.toLowerCase();
        return formState[category].filter(
            item => !item.active && item.name?.toLowerCase().includes(q)
        );
    };

    return (
        <ScrollView contentContainerStyle={SETTINGS.container}>
            <Text style={SETTINGS.title}>Notifications</Text>
            <Text style={SETTINGS.description}>
                Search for the groups, roles, or users you want to receive notifications.
            </Text>


            <View style={styles.columnsWrapper}>
                {CATEGORY_KEYS.map((key, idx) => {
                    const suggestions = getSuggestions(key, inputs[key]);
                    return (
                        <View key={key} style={styles.column}>

                            {/* INPUT/SEARCH */}
                            <Text style={styles.columnTitle}>{{ groups: 'Groups', roles: 'Roles', users: 'Users' }[key]}:</Text>
                            <TextInput
                                placeholder={key.slice(0, -1).replace(/^./, c => c.toUpperCase())}
                                placeholderTextColor="#999"
                                value={inputs[key]}
                                onChangeText={text => setInputs(prev => ({ ...prev, [key]: text }))}
                                style={styles.searchInput}
                            />

                            {/* SUGGESTION */}
                            {suggestions.length > 0 && (
                                <View style={GLOBAL.suggestionsBox}>
                                    {suggestions.map(item => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={GLOBAL.suggestionRow}
                                            onPress={() => {
                                                toggleItem(key, item.id, true);
                                                setInputs(prev => ({ ...prev, [key]: '' }));
                                            }}
                                        >
                                            <Text style={GLOBAL.suggestionText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {idx === 0 ? (
                                <Text style={styles.subscribedLabel}>Subscribed:</Text>
                            ) : (
                                <View style={styles.subscribedLabel} />
                            )}

                            {/* TOGGLE LISTS */}
                            <View style={styles.card}>
                                {formState[key]
                                    .filter(item => item.active || item.wasActive || item.touched) // show if previously active OR currently active
                                    .map(item => (
                                        <View key={item.id} style={styles.cardRow}>
                                            <Text style={styles.cardRowText}>{item.name}</Text>
                                            <View style={styles.switchWrapper}>
                                                <Text style={styles.onLabel}>{item.active ? 'On' : 'Off'}</Text>
                                                <Switch
                                                    value={item.active}
                                                    onValueChange={() => toggleItem(key, item.id)}
                                                    thumbColor="#fff"
                                                    trackColor={{ false: '#ccc', true: COLORS.success }}
                                                />
                                            </View>
                                        </View>
                                    ))}
                            </View>
                        </View>
                    );
                })}
            </View>

            <CancelSaveButtons handleCancel={handleCancel} handleSave={handleSave} feedbackMessage={feedbackMessage}/>
        </ScrollView>
    );
};

export default Notifications;

// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({

    columnsWrapper: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        width: '30%',
    },
    columnTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 14,
    },
    searchInput: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        borderColor: '#c2c2c2',
        borderWidth: 1,
    },

    subscribedLabel: {
        height: 20,
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.text,
        marginVertical: 10,
    },
    card: {
        backgroundColor: '#f4f4f4',
        borderRadius: 12,
        overflow: 'hidden',
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderColor: '#dcdcdc',
    },
    cardRowText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
    },
    switchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onLabel: {
        fontSize: 10,
        marginRight: 4,
        color: COLORS.success,
        fontWeight: '700',
    },

});
