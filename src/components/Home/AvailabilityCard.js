// ─────────────────────────────── IMPORTS ─────────────────────────────── //
import { View, Text, StyleSheet } from 'react-native';

// ─────────────────────────────── UTILS ─────────────────────────────── //
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

const formatHour = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// ─────────────────────────────── COMPONENT ─────────────────────────────── //
const AvailabilityCard = ({name, role, group, location, start, end}) => {
    return (
        <View style={styles.card}>
            <View>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.role}>{role}</Text>
                    </View>
                </View>
                <View style={styles.info}>
                    <Text style={styles.label}>Group:</Text>
                    <Text>{group}</Text>
                </View>
            </View>

            <View>
                <View style={styles.info}>
                    <Text style={styles.label}>Location:</Text>
                    <Text>{location}</Text>
                </View>

                <View style={styles.info}>
                    <Text style={styles.label}>Time:</Text>
                    <Text>{formatDate(start)} - {formatHour(end)}</Text>
                </View>
            </View>

        </View>
    );
}

export default AvailabilityCard;

// ─────────────────────────────── STYLES ─────────────────────────────── //
const styles = StyleSheet.create({

    card: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        elevation: 2,
        gap: 15,
        justifyContent: 'space-between',
        flexGrow:1
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    role: {
        color: 'grey',
    },
    info: {
        marginTop: 4,
    },
    label: {
        fontWeight: 'bold',
    },
});
