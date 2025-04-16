import { View, Text, Image, StyleSheet } from 'react-native';
import initialData from '../data/initial_data';
import { COLORS } from '../styles/theme';

export default function AccountInfo({loggedUserId}) {

  const user = initialData.users[loggedUserId];

  if(!user){
    return(
      <View style={styles.container}>
        <Text style={styles.value}>User not found</Text>
      </View>
    )
  }

  const userRoles = Object.values(initialData.roles)
    .filter(role => role.user_id === loggedUserId)
    .map(role => role.role_name);

  const userGroups = Object.values(initialData.groups)
    .filter(group => group.user_id === loggedUserId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>

      <Image source={{ uri: user.photo_url }} style={styles.pfp} />

      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>@{user.hashtag}</Text>

      <Text style={styles.label}>Complete Name:</Text>
      <Text style={styles.value}>{user.name}</Text>

      <Text style={styles.label}>Roles:</Text>
      <Text style={styles.value}>{userRoles.length ? userRoles.join(', ') : 'No roles assigned'}</Text>

      <Text style={styles.label}>Groups to which it belongs:</Text>
      {userGroups.length ? (
        userGroups.map(group => (
          <View key={group.id} style={styles.groupRow}>
            <Text style={styles.groupTextName}>@{group.hashtag}</Text>
            <Text style={styles.groupText}>{group.name}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.value}>No groups assigned</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  title: {
    paddingLeft: 200,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingTop: 20,
    color: COLORS.primary,
  },
  pfp: {
    marginLeft: 200,
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  label: {
    paddingLeft: 200,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    color: COLORS.text,
  },
  value: {
    paddingLeft: 200,
    fontSize: 16,
    marginBottom: 4,
    color: COLORS.text,
  },
  groupRow: {
    paddingLeft: 200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  groupText: {
    margin:0,
    paddingRight:25,
    fontSize: 14,
    color: COLORS.text,
  },
  groupTextName: {
    fontSize: 14,
    color: COLORS.text,
  },
});
