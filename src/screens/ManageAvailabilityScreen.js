import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import ManageAvailabilityForm from '../components/ManageAvailability/ManageAvailability';

export default function ManageAvailabilityScreen({ availabilityId }) {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = doc(db, 'availabilities', availabilityId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAvailability({ ...docSnap.data(), firestore_id: docSnap.id });
        } else {
          Alert.alert('Error', 'Availability not found');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch availability data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (availabilityId) {
      fetchData();
    } else {
      Alert.alert('Error', 'No availability ID provided');
      setLoading(false);
    }
  }, [availabilityId]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!availability) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  const handleSuccess = (updatedData) => {
    Alert.alert('Success', 'Availability updated successfully');
    setAvailability(updatedData);
  };

  return (
    <View style={{ flex: 1 }}>
      <ManageAvailabilityForm
        initialData={availability}
        onSuccess={handleSuccess}
      />
    </View>
  );
}
