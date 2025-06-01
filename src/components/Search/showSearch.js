
import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';

export default function Datalist({ inputValue }) {
    const navigation = useNavigation();
    const { loggedUserId } = useUser();

    const [searchText, setSearchText] = useState(inputValue);
    const [showFilters, setShowFilters] = useState(false);

    const [selectedRoleName, setSelectedRoleName] = useState('All');
    const [minMembers, setMinMembers] = useState('');
    const [maxMembers, setMaxMembers] = useState('');
    const [autoAdmissionOnly, setAutoAdmissionOnly] = useState(false);
    const [availabilityType, setAvailabilityType] = useState('All');
    const [availabilityDateFilter, setAvailabilityDateFilter] = useState('All');

    const [groupUsers, setGroupUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [availabilities, setAvailabilities] = useState([]);
    const [roles, setRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [groupUsersSnap, usersSnap, groupsSnap, availabilitiesSnap, rolesSnap, userRolesSnap] =
                await Promise.all([
                    getDocs(collection(db, 'group_users')),
                    getDocs(collection(db, 'users')),
                    getDocs(collection(db, 'groups')),
                    getDocs(collection(db, 'availabilities')),
                    getDocs(collection(db, 'roles')),
                    getDocs(collection(db, 'user_has_role')),
                ]);

            setGroupUsers(groupUsersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setUsers(usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setGroups(groupsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setAvailabilities(availabilitiesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setRoles(rolesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            setUserRoles(userRolesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };

        fetchData();
    }, []);

    const getUserById = (id) => users.find((u) => u.id === id);

    const isUserOwnerOfGroup = (groupId, userId) => {
        return groups.some(
            (g) => g.id?.toString() === groupId.toString() && g.user_id?.toString() === userId.toString()
        );
    };

    const isUserApprovedMemberOfGroup = (groupId, userId) => {
        return groupUsers.some(
            (gu) =>
                gu.group_id?.toString() === groupId.toString() &&
                gu.user_id?.toString() === userId.toString() &&
                gu.status === 'approved'
        );
    };


    const filterBySearch = (items, key = 'name') =>
        items.filter((item) => item[key]?.toLowerCase().includes(searchText.toLowerCase()));

    const countApprovedUsers = (groupId) =>
        groupUsers.filter((gu) => gu.group_id === groupId && gu.status === 'approved').length;

    const getFilteredUsers = () => {
        if (selectedRoleName === 'All') return filterBySearch(users);

        const selectedRoleObj = roles.find((r) => r.role_name === selectedRoleName);
        if (!selectedRoleObj) return [];

        const selectedRoleId = selectedRoleObj.id;

        const matchingUserIds = userRoles
            .filter((ur) => ur.role_id === selectedRoleId && ur.active)
            .map((ur) => ur.user_id?.toString());

        return filterBySearch(users.filter((u) => matchingUserIds.includes(u.id?.toString())));
    };

    const getFilteredGroups = () => {
        let filtered = groups.filter((g) => g.is_public);

        const min = minMembers ? parseInt(minMembers, 10) : 0;
        const max = maxMembers ? parseInt(maxMembers, 10) : Number.MAX_SAFE_INTEGER;

        filtered = filtered.filter((g) => {
            const approved = countApprovedUsers(g.id);
            return approved >= min && approved <= max;
        });

        if (autoAdmissionOnly) {
            filtered = filtered.filter((g) => g.auto_admission === true);
        }

        return filterBySearch(filtered);
    };

    const isSameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const isSameMonth = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();

    const isSameWeek = (d1, d2) => {
        const a = new Date(d1);
        const b = new Date(d2);
        const dayA = a.getDay() === 0 ? 7 : a.getDay();
        const dayB = b.getDay() === 0 ? 7 : b.getDay();
        a.setDate(a.getDate() - dayA + 1);
        b.setDate(b.getDate() - dayB + 1);
        a.setHours(0, 0, 0, 0);
        b.setHours(0, 0, 0, 0);
        return a.getTime() === b.getTime();
    };

    const filteredGroupsArray = useMemo(getFilteredGroups, [
        groups,
        loggedUserId,
        minMembers,
        maxMembers,
        autoAdmissionOnly,
        searchText,
    ]);

    const filteredAvailabilitiesArray = useMemo(() => {
        return availabilities.filter((availability) => {
            const user = getUserById(availability.user_id);
            if (!user || !user.name.toLowerCase().includes(searchText.toLowerCase())) return false;

            const date = new Date(availability.start_date);
            const now = new Date();

            if (availabilityType === 'Online' && availability.is_geolocated) return false;
            if (availabilityType === 'Presential' && !availability.is_geolocated) return false;

            if (availabilityDateFilter === 'Today' && !isSameDay(date, now)) return false;
            if (availabilityDateFilter === 'ThisWeek' && !isSameWeek(date, now)) return false;
            if (availabilityDateFilter === 'ThisMonth' && !isSameMonth(date, now)) return false;

            return true;
        });
    }, [availabilities, searchText, availabilityType, availabilityDateFilter]);

    return (
        <View style={styles.outerContainer}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                />

                <ScrollView style={styles.scrollArea}>
                    {/* --------- GROUPS --------- */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Groups</Text>
                        {filteredGroupsArray.map((group) => {
                            const approvedCount = countApprovedUsers(group.id);

                            return (
                                <TouchableOpacity
                                    key={group.id}
                                    style={styles.item}
                                    onPress={() => {
                                        let screen = 'JoinGroup';

                                        if (isUserOwnerOfGroup(group.id, loggedUserId)) {
                                            screen = 'GroupSettings';
                                        } else if (isUserApprovedMemberOfGroup(group.id, loggedUserId)) {
                                            screen = 'GroupMembers';
                                        }

                                        navigation.navigate('Groups', {
                                            screen: screen,
                                            params: { groupId: String(group.id) },
                                        });
                                    }}
                                >
                                    <View>
                                        <Text style={styles.itemText}>{group.name}</Text>
                                        <Text style={styles.itemCount}>#{group.hashtag}</Text>
                                    </View>
                                </TouchableOpacity>


                            );
                        })}
                    </View>

                    {/* --------- AVAILABILITIES --------- */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Availabilities</Text>
                        {filteredAvailabilitiesArray.map((availability) => {
                            const user = getUserById(availability.user_id);
                            const username = user ? user.name : `User ${availability.user_id}`;
                            const date = new Date(availability.start_date);
                            const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
                                .toString()
                                .padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date
                                .getMinutes()
                                .toString()
                                .padStart(2, '0')}`;

                            return (
                                <TouchableOpacity
                                    key={availability.id}
                                    style={styles.item}
                                    onPress={() => navigation.navigate('AvailabilityDetails', { availabilityId: availability.id })}
                                >
                                    <Text style={styles.itemText}>{username}</Text>
                                    <Text style={styles.itemCount}>{formattedDate}</Text>
                                </TouchableOpacity>

                            );
                        })}
                    </View>

                    {/* --------- USERS --------- */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Users</Text>
                        {getFilteredUsers().map((user) => (
                            <TouchableOpacity
                                key={user.id}
                                style={styles.item}
                                onPress={() => navigation.navigate('OthersProfile', { userId: user.id })}
                            >
                                <Text style={styles.itemText}>{user.name}</Text>
                                <Text style={styles.itemCount}>#{user.hashtag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </ScrollView>
            </View>

            {/* FILTERS */}
            <View style={styles.filterButtonContainer}>
                <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.iconButton}>
                    <Ionicons name="filter" size={36} color="#000" />
                </TouchableOpacity>

                {showFilters && (
                    <View style={styles.filterDropdown}>
                        <Text style={styles.filterLabel}>USERS</Text>
                        <Text style={styles.filterLabel}>Role</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker selectedValue={selectedRoleName} onValueChange={setSelectedRoleName}>
                                <Picker.Item label="All" value="All" />
                                {roles.map((role) => (
                                    <Picker.Item key={role.id} label={role.role_name} value={role.role_name} />
                                ))}
                            </Picker>
                        </View>

                        <Text style={styles.filterLabel}>GROUPS</Text>
                        <Text style={styles.filterLabel}>Members</Text>
                        <View style={styles.memberRangeContainer}>
                            <TextInput
                                style={styles.memberInput}
                                value={minMembers}
                                onChangeText={setMinMembers}
                                keyboardType="numeric"
                                placeholder="From"
                            />
                            <TextInput
                                style={styles.memberInput}
                                value={maxMembers}
                                onChangeText={setMaxMembers}
                                keyboardType="numeric"
                                placeholder="To"
                            />
                        </View>
                        <View style={styles.autoAdmissionContainer}>
                            <Text style={styles.filterLabel}>Auto Admission</Text>
                            <Switch value={autoAdmissionOnly} onValueChange={setAutoAdmissionOnly} />
                        </View>

                        <Text style={styles.filterLabel}>AVAILABILITIES</Text>
                        <Text style={styles.filterLabel}>Type</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker selectedValue={availabilityType} onValueChange={setAvailabilityType}>
                                <Picker.Item label="All" value="All" />
                                <Picker.Item label="Online" value="Online" />
                                <Picker.Item label="Presential" value="Presential" />
                            </Picker>
                        </View>
                        <Text style={styles.filterLabel}>Date</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker selectedValue={availabilityDateFilter} onValueChange={setAvailabilityDateFilter}>
                                <Picker.Item label="All" value="All" />
                                <Picker.Item label="Today" value="Today" />
                                <Picker.Item label="This Week" value="ThisWeek" />
                                <Picker.Item label="This Month" value="ThisMonth" />
                            </Picker>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}


// -------------------------------- Styles -------------------------------- //
const styles = StyleSheet.create({
    outerContainer: {
        position: 'absolute',
        top: '22.5%',
        left: '18%',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    container: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 20,
        height: 500,
        width: 400,
    },
    filterButtonContainer: {
        marginLeft: 10,
        alignItems: 'flex-start',
    },
    iconButton: {
        padding: 8,
    },
    filterDropdown: {
        marginTop: 6,
        backgroundColor: '#d3d3d3',
        borderRadius: 6,
        padding: 10,
        elevation: 3,
        width: 250,
        marginLeft: 20,
    },
    filterLabel: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 6,
    },
    memberRangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    memberInput: {
        backgroundColor: '#fff',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        width: 90,
    },
    autoAdmissionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    pickerWrapper: {
        width: '100%',
        height: 40,
        marginBottom: 10,
    },
    searchInput: {
        backgroundColor: '#eee',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 10,
    },
    scrollArea: {
        maxHeight: '90%',
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 16,
    },
    item: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    itemText: {
        color: '#000',
    },
    itemCount: {
        color: '#666',
    },
});
