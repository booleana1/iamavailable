import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Modal, Alert } from 'react-native';
import { db } from '../../firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BlurredAddUser({ navigation, loggedUserId }) {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [username, setUsername] = useState('');

  const handleAddUser = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    try {
      await addDoc(collection(db, 'users'), {
        name: username,
        created_at: serverTimestamp(),
        // Añade otros campos necesarios aquí
      });
      console.log('User added successfully!');
      navigation.navigate('GroupManagement', { loggedUserId });
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Failed to add user');
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
          navigation.navigate('GroupManagement', { loggedUserId });
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
              onPress={handleAddUser}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: '#0099ff',
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
    backgroundColor: '#d9d9d9',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#d9d9d9',
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
