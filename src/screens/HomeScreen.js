import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import initialData from '../data/initial_data';
import Header from '../components/Header';
import AvailabilityCard from '../components/AvailabilityCard';
import {COLORS} from "../styles/theme";

export default function HomeScreen() {
    const [myAvailabilities, setMyAvailabilities] = useState({});
    const [otherAvailabilities, setOtherAvailabilities] = useState({});

    const loggedUserId = 1;

    useEffect(() => {
        const availabilitiesArray = Object.values(initialData.availabilities);

        const enrichedAvailabilities = availabilitiesArray.map((availability) => {
            const user = initialData.users[availability.user_id];
            const role = Object.values(initialData.roles).find(r => r.user_id === user.id);
            const group = initialData.groups[availability.group_id];

            return {
                id: availability.id,
                userName: user.name,
                roleName: role?.role_name,
                groupName: group?.name,
                start: availability.start_date,
                end: availability.end_date,
                location: availability.location,
                userId: user.id,
            };
        });

        const myData = {};
        const otherData = {};

        enrichedAvailabilities.forEach(item => {
            if (item.userId === loggedUserId) {
                myData[item.id] = item;
            } else {
                otherData[item.id] = item;
            }
        });

        setMyAvailabilities(myData);
        setOtherAvailabilities(otherData);
    }, []);

    return (
        <View style={styles.container}>
            <Header/>
            <ScrollView style={styles.container}>
                <View style={styles.sections}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My Availabilities</Text>
                        {Object.values(myAvailabilities).map(item => (
                            <AvailabilityCard
                                key={item.id}
                                name={item.userName}
                                role={item.roleName}
                                group={item.groupName}
                                location={item.location}
                                start={item.start}
                                end={item.end}
                            />
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Other Availabilities</Text>
                        {Object.values(otherAvailabilities).map(item => (
                            <AvailabilityCard
                                key={item.id}
                                name={item.userName}
                                role={item.roleName}
                                group={item.groupName}
                                location={item.location}
                                start={item.start}
                                end={item.end}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.fab}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    sections: {
        padding: 16,
    },
    section: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        marginBottom: 8,
        textAlign: 'center',
    },
    fab: {
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        position: 'absolute',
        bottom: 32,
        right: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabText: {
        color: 'white',
        fontSize: 32,
    },
});
