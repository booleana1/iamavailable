import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';

export default function FormsRecoverPasswordScreen() {
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== repeatPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const auth = getAuth();

      // Verificar el código de verificación
      const email = await verifyPasswordResetCode(auth, verificationCode);

      // Confirmar el cambio de contraseña
      await confirmPasswordReset(auth, verificationCode, newPassword);

      setMessage('Password reset successfully!');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Recover password</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Verification code</Text>
          <TextInput
            placeholder="Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>New password</Text>
          <TextInput
            placeholder="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Repeat the password</Text>
          <TextInput
            placeholder="Repeat the password"
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleResetPassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.doneButtonText}>Done</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Go back
        </Text>

        {message ? <Text style={styles.message}>{message}</Text> : null}
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
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: 'black',
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
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: 'black',
  },
  message: {
    marginTop: 10,
    textAlign: 'center',
    color: 'green',
  },
});
