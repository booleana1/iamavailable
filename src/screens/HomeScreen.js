import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AvailabilityCard from '../components/AvailabilityCard';
import {COLORS} from "../styles/theme";

export default function HomeScreen({loggedUserId, dataAvailabilities, dataUsers, dataRoles,dataGroups}) {
    const [myAvailabilities, setMyAvailabilities] = useState({});
    const [otherAvailabilities, setOtherAvailabilities] = useState({});

    // menu useState
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // get availability data when the app stars when dataAvailabilities change and when loggedUserId changes
    useEffect(() => {
        // Convert object of availabilities to array
        const availabilitiesArray = Object.values(dataAvailabilities);

        // Map the array to enrichedAvailabilities in the format needed for now
        const enrichedAvailabilities = availabilitiesArray.map((availability) => {
            const user = dataUsers[availability.user_id];
            const role = dataRoles[availability.role_id];
            const group = dataGroups[availability.group_id];

            return {
                id: availability.id,
                userName: user?.name,
                roleName: role?.role_name,
                groupName: group?.name,
                location: availability.location,
                start: availability.start_date,
                end: availability.end_date,
                userId: user?.id,
            };
        });

        // Separate the data into myAvailabilities vs otherAvailabilities
        const myData = {};
        const otherData = {};

        enrichedAvailabilities.forEach((item) => {
            if (item.userId === loggedUserId) {
                myData[item.id] = item;
            } else {
                otherData[item.id] = item;
            }
        });

        setMyAvailabilities(myData);
        setOtherAvailabilities(otherData);
    }, [loggedUserId, dataAvailabilities]);


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
