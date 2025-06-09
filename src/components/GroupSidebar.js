import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GroupSidebar({ myGroups, otherGroups }) {
  return (
    <View style={styles.sidebar}>
      <Text style={styles.sidebarTitle}>My groups</Text>
      {myGroups.map((group, index) => (
        <View key={index} style={styles.groupItem}>
          <Text style={styles.groupName}>{group.name}</Text>
        </View>
      ))}
      <View style={styles.separator} />
      <Text style={styles.sidebarTitle}>Other's Groups</Text>
      {otherGroups.map((group, index) => (
        <View key={index} style={styles.groupItem}>
          <Text style={styles.groupName}>{group.name}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: '20%', // Ancho fijo para el sidebar
    backgroundColor: '#fff',
    padding: 15,
    borderRightWidth: 1, // Línea de separación más fina
    borderRightColor: '#ddd',
    height: '100%', // Ocupa toda la altura de la pantalla
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  groupItem: {
    paddingVertical: 5,
  },
  groupName: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    borderBottomWidth: 1, // Línea de separación entre secciones
    borderBottomColor: '#ddd',
    marginVertical: 15, // Espacio adicional entre secciones
  },
});
;