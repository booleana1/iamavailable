import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { useNavigation } from '@react-navigation/native';

export default function FormsLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const validate = () => {
    const errors = [];
    if (!email.trim()) errors.push('E‑mail é obrigatório');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('E‑mail inválido');
    if (!password) errors.push('Senha é obrigatória');
    return errors;
  };

  const handleLogin = async () => {
    const errs = validate();
    if (errs.length) {
      Alert.alert('Validação', errs.join('\n'));
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      let message = 'Falha ao entrar.';
      if (error.code === 'auth/user-not-found') message = 'Usuário não encontrado';
      if (error.code === 'auth/wrong-password') message = 'Senha incorreta';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
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
                returnKeyType="done"
            />
          </View>

          <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
          >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text style={styles.signUp} onPress={() => navigation.navigate('Register')}>
              Sign up
            </Text>
          </Text>

          <Text
              style={styles.forgotPasswordText}
              onPress={() => navigation.navigate('ForgotPassword')}
          >
            Forgot your password?
          </Text>
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
  loginButton: {
    backgroundColor: '#00d084',
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
  },
  signUp: {
    color: '#00d084',
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    marginTop: 10,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'normal',
  },
});
