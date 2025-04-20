import React, { useState, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    Switch,
} from 'react-native';
import { COLORS } from '../styles/theme';
import CancelSaveButtons from "./CancelSaveButtons";
import {GLOBAL} from "../styles/global";

// ─────────────────────────────── CONSTANT ─────────────────────────────── //
const CATEGORY_KEYS = ['groups', 'roles', 'users'];

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const SettingsNotifications = ({ loggedUserId, dataGroups, dataRoles, dataUsers, onSave, onCancel }) => {

    const allItems = useMemo(() => {
        const build = list =>
            list.map(obj => ({
                id: obj.id,
                name: obj.name ?? obj.role_name,
                active: obj.active ?? false,
                wasActive: obj.active ?? false, // persisted state
                touched: false, // changed in current session
            }));

        return {
            groups: build(Object.values(dataGroups)),
            roles: build(Object.values(dataRoles)),
            users: build(Object.values(dataUsers)),
        };
    }, [dataGroups, dataRoles, dataUsers]);

    const [formState, setFormState] = useState(allItems);
    const [inputs, setInputs] = useState({ groups: '', roles: '', users: '' });


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
        setInputs({ groups: '', roles: '', users: '' });
        onCancel?.();
    };

    const handleSave = () => {
        // filters active subscription
        const subscriptionUpdate = CATEGORY_KEYS.reduce((subs, cat) => {
            subs[cat] = formState[cat].filter(item => item.active);
            return subs;
        }, {});

        // reset touched, and set wasActive with the last active status
        setFormState(prev =>
            CATEGORY_KEYS.reduce((acc, cat) => {
                acc[cat] = prev[cat].map(i => ({
                    ...i,
                    wasActive: i.active,
                    touched: false,
                }));
                return acc;
            }, {}),
        );
        // send active subscription to parent
        onSave?.({subscriptionUpdate});
    };



    const getSuggestions = (category, query) => {
        if (!query) return [];
        const q = query.toLowerCase();
        return formState[category].filter(
            item => !item.active && item.name.toLowerCase().includes(q),
        );
    };


    return (
        <ScrollView contentContainerStyle={GLOBAL.settings_container}>
            <Text style={GLOBAL.title}>Notifications</Text>
            <Text style={GLOBAL.description}>
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
                                <View style={styles.suggestionsBox}>
                                    {suggestions.map(item => (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.suggestionRow}
                                            onPress={() => {
                                                toggleItem(key, item.id, true);
                                                setInputs(prev => ({ ...prev, [key]: '' }));
                                            }}
                                        >
                                            <Text style={styles.suggestionText}>{item.name}</Text>
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

            <CancelSaveButtons handleCancel={handleCancel} handleSave={handleSave} />
        </ScrollView>
    );
};

export default SettingsNotifications;

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
    suggestionsBox: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dcdcdc',
        borderRadius: 6,
        marginTop: 4,
        marginBottom: 20,
        maxHeight: 120,
    },
    suggestionRow: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    suggestionText: {
        fontSize: 13,
        color: COLORS.text,
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
