import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AvailabilityCard from '../components/Home/AvailabilityCard';
import {COLORS} from "../styles/theme";
import { collection, query, where, getDoc, getDocs, doc, or } from "firebase/firestore";
import {app, db, auth} from '../../firebase.config'

const getUserApprovedGroupIds = async (userId) => {
    const q = query(
        collection(db, 'group_users'),
        where('user_id', '==', userId),
        where('status', '==', 'approved')
    );

    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data().group_id);
};

const buildAvailability = (aval, usersMap, rolesMap, groupsMap) => ({
    id: aval.id,
    userName: usersMap[aval.user_id]?.name || '',
    roleName: rolesMap[aval.role_id]?.role_name || '',
    groupName: groupsMap[aval.group_id]?.name || '',
    location: aval.location,
    start: aval.start_date,
    end: aval.end_date,
    userId: aval.user_id,
});


export default function HomeScreen({loggedUserId, setPhotoUrl}) {
    const [myAvailabilities, setMyAvailabilities] = useState({});
    const [otherAvailabilities, setOtherAvailabilities] = useState({});

    useEffect(() => {

        const loadData = async () => {
            try {
                // get availabilities from user -> My Availabilities
                const userSnap = await getDocs(
                    query(collection(db, 'availabilities'), where('user_id', '==', loggedUserId))
                );

                // get approved groups id -> Other Availabilities
                const groupIds = await getUserApprovedGroupIds(loggedUserId);

                // get availabilities from approved groups -> Other Availabilities
                let groupSnap = { docs: [] };
                if (groupIds.length > 0) {
                    groupSnap = await getDocs(
                        query(collection(db, 'availabilities'), where('group_id', 'in', groupIds))
                    );
                }

                // all the availabilities needed -> My and Other Availabilities
                const allDocs = [...userSnap.docs, ...groupSnap.docs];

                // get user, roles and groups snaps
                const [usersSnap, rolesSnap, groupsSnap] = await Promise.all([
                    getDocs(collection(db, 'users')),
                    getDocs(collection(db, 'roles')),
                    getDocs(collection(db, 'groups')),
                ]);

                // get user, roles, and groups data
                const usersMap = Object.fromEntries(usersSnap.docs.map(d => [d.id, d.data()]));
                const rolesMap = Object.fromEntries(rolesSnap.docs.map(d => [d.id, d.data()]));
                const groupsMap = Object.fromEntries(groupsSnap.docs.map(d => [d.id, d.data()]));

                // separate in my and other groups
                const my = {};
                const others = {};

                await Promise.all(
                    allDocs.map(async (docSnap) => {
                        // get single availability
                        const availabilities = { id: docSnap.id, ...docSnap.data() };
                        // see if is already included
                        if ((availabilities.user_id === loggedUserId && my[availabilities.id]) ||
                            (groupIds.includes(availabilities.group_id) && others[availabilities.id])) {
                            return;
                        }
                        // get data structures with all the needed data to show
                        const enriched = buildAvailability(availabilities, usersMap, rolesMap, groupsMap);
                        // distribute between my and other availabilities
                        if (availabilities.user_id === loggedUserId)
                            my[enriched.id] = enriched;
                        else if (groupIds.includes(availabilities.group_id))
                            others[enriched.id] = enriched;
                    }),
                );

                setMyAvailabilities(my);
                setOtherAvailabilities(others);
            } catch (error) {
                console.error(error);
            }
        };

        loadData();
    }, [loggedUserId]);




    // menu useState
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <View style={styles.container}>

            <ScrollView>
                <View style={styles.sections}>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My Availabilities</Text>
                        {Object.values(myAvailabilities).map(item => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() =>
                                    alert('Here we go to Availability Details')
                                }
                            >
                                <AvailabilityCard
                                    name={item.userName}
                                    role={item.roleName}
                                    group={item.groupName}
                                    location={item.location}
                                    start={item.start}
                                    end={item.end}
                                />
                            </TouchableOpacity>
                        ))}

                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Others Availabilities</Text>

                        {Object.values(otherAvailabilities).map(item => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() =>
                                alert('Here we go to Availability Details')
                            }>
                                <AvailabilityCard
                                    key={item.id}
                                    name={item.userName}
                                    role={item.roleName}
                                    group={item.groupName}
                                    location={item.location}
                                    start={item.start}
                                    end={item.end}
                                />
                            </TouchableOpacity>

                        ))}


                    </View>
                </View>
            </ScrollView>


            <TouchableOpacity style={styles.fab} onPress={() => setIsMenuOpen(prev => !prev)}>
                <Text style={styles.fabText}>{isMenuOpen ? '-' : '+'}</Text>
            </TouchableOpacity>

            {isMenuOpen && (
                <View style={styles.menu}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            alert('Create Chat')
                        }
                    >
                        <Text style={styles.menuText}>Create Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            alert('Create Group')
                        }
                    >
                        <Text style={styles.menuText}>Create Group</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            alert('Create Availability')
                        }
                    >
                        <Text style={styles.menuText}>Create Availability</Text>
                    </TouchableOpacity>
                </View>

            )}
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    sections: {
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: COLORS.background,
    },

    section: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        margin: 10,
        width: 350
    },

    sectionTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 500,
        marginBottom: 8,
        textAlign: 'center',
    },
    fab: {
        backgroundColor: COLORS.primary,
        width: 80,
        height: 80,
        borderRadius: 60,
        position: 'absolute',
        bottom: 32,
        right: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabText: {
        color: 'white',
        fontSize: 48,
    },
    menu: {
        position: 'absolute',
        bottom: 60,
        right: 130,

    },
    menuItem: {
        backgroundColor: 'white',
        borderColor: COLORS.primary,
        borderWidth: 3,
        borderRadius: 20,
        padding: 20,
        margin: 10,
    },
    menuText: {
        fontSize: 24,
        fontWeight: 500,
    }
});
