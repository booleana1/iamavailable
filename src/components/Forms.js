import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { db } from '../../firebase.config';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function Forms() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [photoBase64, setPhotoBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    const fetchMaxId = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('id', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const maxId = querySnapshot.docs[0].data().id;
          setNextId(maxId + 1);
        }
      } catch (error) {
        console.error('Error fetching max ID:', error);
      }
    };

    fetchMaxId();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setPhotoBase64(base64Img);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Crear un nuevo usuario en la colección 'users'
      await addDoc(collection(db, 'users'), {
        id: nextId,
        name: name,
        hashtag: username,
        email: email,
        password_hash: password, 
        photo_url: photoBase64,
        created_at: serverTimestamp(),
      });
      setFeedbackMessage('Account created successfully!');
    } catch (error) {
      console.error('Error creating account:', error);
      setFeedbackMessage('Error creating account.');
    } finally {
      setLoading(false);
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create an account</Text>

        <TouchableOpacity style={styles.addImage} onPress={pickImage}>
          {photoBase64 ? (
            <Image source={{ uri: photoBase64 }} style={styles.addImageIcon} />
          ) : (
            <View style={styles.addImageIcon}>
              <Text>Add Image</Text>
            </View>
          )}
          <Text style={styles.addImageText}>Add image</Text>
        </TouchableOpacity>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.doneButtonText}>Done</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.signIn}>Sign in</Text>
        </Text>

        {feedbackMessage ? <Text style={styles.feedback}>{feedbackMessage}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  form: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  addImage: {
    alignItems: 'center',
    marginBottom: 20,
  },
  addImageIcon: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderStyle: 'dashed',
  },
  addImageText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 20,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 12,
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: '#00d084',
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
  },
  signIn: {
    color: '#00d084',
    fontWeight: 'bold',
  },
  feedback: {
    marginTop: 10,
    textAlign: 'center',
    color: 'green',
  },
});
