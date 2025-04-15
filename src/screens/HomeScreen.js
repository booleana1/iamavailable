import {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useWindowDimensions, Alert
} from 'react-native';
import initialData from '../data/initial_data';
import Header from '../components/Header';
import AvailabilityCard from '../components/AvailabilityCard';
import {COLORS} from "../styles/theme";

export default function HomeScreen() {
    const [myAvailabilities, setMyAvailabilities] = useState({});
    const [otherAvailabilities, setOtherAvailabilities] = useState({});

    const loggedUserId = 1;

    const {width} = useWindowDimensions();
    const isSmallScreen = width < 768;

    const [isMenuOpen, setIsMenuOpen] = useState(false);


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


            <ScrollView>
                <Header/>
                <View style={[
                    isSmallScreen ? styles.sectionsSmallScreen : styles.sections
                ]}>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My Availabilities</Text>
                        {Object.values(myAvailabilities).map(item => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() =>
                                    Alert.alert('Availability Details', 'Here we go to Availability Details')
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
                            <TouchableOpacity>
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
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Create Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Create Group</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
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
        backgroundColor: COLORS.primary,
    },
    sections: {
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: COLORS.background,
    },
    sectionsSmallScreen: {
        flexDirection: 'column',
        padding: 16,
        justifyContent: 'center',
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
