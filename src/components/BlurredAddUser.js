import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Modal } from 'react-native';

export default function BlurredAddUser({ loggedUserId, navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [username, setUsername] = useState('');

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#555"
              value={username}
              onChangeText={setUsername}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                console.log(`Add user: ${username}`);
                setIsModalVisible(false);
              }}
            >
              <Text style={styles.addButtonText}>Add User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro desenfocado
  },
  modalView: {
    width: 300,
    backgroundColor: '#0099ff', // Azul de fondo
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  input: {
    width: 200,
    height: 40,
    backgroundColor: '#d9d9d9', // Gris claro
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#d9d9d9', // Botón gris
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
