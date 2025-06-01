import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { db } from '../../firebase.config';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function FormsCreateGroupsScreen({ navigation }) {
  const [name, setName] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [autoAdmission, setAutoAdmission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    const fetchMaxId = async () => {
      try {
        const q = query(collection(db, 'groups'), orderBy('id', 'desc'), limit(1));
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'groups'), {
        name: name,
        hashtag: hashtag,
        description: description,
        is_public: isPublic,
        auto_admission: autoAdmission,
        created_at: serverTimestamp(),
        updatedAt: serverTimestamp(),
        user_id: 1,
      });
      setFeedbackMessage('Group created successfully!');
      navigation.navigate('GroupDetails', { groupId: docRef.id });
    } catch (error) {
      console.error('Error creating group:', error);
      setFeedbackMessage('Error creating group.');
    } finally {
      setLoading(false);
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Create a new group</Text>

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
          <Text style={styles.label}>Hashtag</Text>
          <TextInput
            placeholder="Hashtag"
            value={hashtag}
            onChangeText={setHashtag}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
          />
        </View>


        <View style={styles.field}>
          <Text style={styles.label}>Public/Private</Text>
          <View style={styles.switchContainer}>
            <Text>Private</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
            />
            <Text>Public</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Self-admission</Text>
          <View style={styles.switchContainer}>
            <Text>No</Text>
            <Switch
              value={autoAdmission}
              onValueChange={setAutoAdmission}
            />
            <Text>Yes</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.doneButtonText}>Done</Text>
          )}
        </TouchableOpacity>

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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 10,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: '#00d084',
    width: '100%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedback: {
    marginTop: 10,
    textAlign: 'center',
    color: 'green',
  },
});
