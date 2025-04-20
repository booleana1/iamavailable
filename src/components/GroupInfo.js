import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Sidebar from './GroupSidebar';


export default function GroupInfo() {
  // Datos de ejemplo para los grupos y usuarios
  const myGroups = [
    { name: 'MyGroup1' },
    { name: 'MyGroup2' },
  ];
  const otherGroups = [
    { name: 'OtherGroup1' },
    { name: 'OtherGroup2' },
  ];
  const users = [
    { name: 'Student 1' },
    { name: 'Student 2' },
    { name: 'Student 3' },
    { name: 'Student 4' },
  ];

  // Renderizar la tabla de usuarios
  const renderUsersTable = () => (
    <View style={styles.usersTable}>
      <Text style={styles.tableTitle}>Users</Text>
      {users.map((user, index) => (
        <View key={index} style={styles.userItem}>
          <Text style={styles.userName}>{user.name}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Sidebar fijo a la izquierda */}
      <Sidebar myGroups={myGroups} otherGroups={otherGroups} />

      {/* Contenido principal */}
      <View style={styles.mainContent}>
        {/* Fila superior: GROUP DETAILS y Users */}
        <View style={styles.topRow}>
          {/* Título "GROUP DETAILS" */}
          <Text style={styles.title}>GROUP DETAILS</Text>

          {/* Tabla de usuarios */}
          {renderUsersTable()}
        </View>

        {/* Contenedor para las filas de detalles */}
        <View style={styles.detailsContainer}>
          {/* Fila para Name y Hashtag juntos */}
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.text}>GROUP NAME</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Hashtag</Text>
              <Text style={styles.text}>#UniqueHashtag</Text>
            </View>
          </View>

          {/* Fila para Description */}
          <View style={styles.row}>
            <View style={styles.rowItemFull}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.text}>
                This is the group description.{"\n"}
                Here the professor can say the group is about...
              </Text>
            </View>
          </View>

          {/* Fila para Type y Admission juntos */}
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.text}>Public</Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Admission</Text>
              <Text style={styles.text}>Self-Admission</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Layout en fila para el sidebar y el contenido principal
    backgroundColor: '#f0f0f0',
  },
  mainContent: {
    flex: 1, // Ocupa el espacio restante después del sidebar
    padding: 20,
    backgroundColor: '#fff',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Alinear al inicio verticalmente
    marginBottom: 0, // Espacio debajo de GROUP DETAILS
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10, // Espacio debajo del título
  },
  detailsContainer: {
    marginTop: -100, // Subir las filas hacia arriba
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Alinear elementos a la izquierda
    marginBottom: 10, // Espacio entre filas
  },
  rowItem: {
    width: '45%', // Ajustar ancho para que quepan juntos
    marginRight: 20, // Espacio entre elementos
  },
  rowItemFull: {
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  usersTable: {
    width: '25%', // Ancho fijo para la tabla de usuarios
    marginLeft: 30, // Mover ligeramente a la derecha
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    paddingVertical: 5,
  },
  userName: {
    fontSize: 16,
    color: '#333',
  },
});

