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

const CATEGORY_KEYS = ['groups', 'roles', 'users'];

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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>
                Search for the groups, roles, or users you want to receive notifications.
            </Text>

            <View style={styles.columnsWrapper}>
                {CATEGORY_KEYS.map((key, idx) => {
                    const suggestions = getSuggestions(key, inputs[key]);
                    return (
                        <View key={key} style={styles.column}>
                            <Text style={styles.columnTitle}>{{ groups: 'Groups', roles: 'Roles', users: 'Users' }[key]}:</Text>
                            <TextInput
                                placeholder={key.slice(0, -1).replace(/^./, c => c.toUpperCase())}
                                placeholderTextColor="#999"
                                value={inputs[key]}
                                onChangeText={text => setInputs(prev => ({ ...prev, [key]: text }))}
                                style={styles.searchInput}
                            />

                            {/* Suggestions */}
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

            <View style={styles.bottomContainer}>
                <View style={styles.line} />
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default SettingsNotifications;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.text,
        marginTop: 30,
        marginBottom: 40,
    },
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
        fontWeight: '600',
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
        fontWeight: '600',
    },
});
