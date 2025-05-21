//the page of login screen.
import { useState } from 'react'; //
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native'; //import the necessssary components from react-native.
import { router } from 'expo-router';
import { Play } from 'lucide-react-native';
import React from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState(''); //state to store the email entered by the user.
  const [password, setPassword] = useState('');
  const users = [ 
    { email: 'abdou@example.com', password: 'Password123' },
    { email: 'yassin@example.com', password: 'Secure456' },
    { email: 'adil@example.com', password: 'Adminpass' },
  ];
  const handleLogin = () => { //this fonction called when the user press the login button.
    const user = users.find((user) => user.email === email && user.password === password);
    if (!user) {
      alert('Invalid email or password');
      return;
    }else{
  
      router.push('/(tabs)');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop' }}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Play size={40} color="#E50914" strokeWidth={3} />
            <Text style={styles.logoText}>Watchmee</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

     
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E50914',
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#E50914',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 5,
  },
  footerText: {
    color: '#999',
    fontSize: 16,
  },
  signupText: {
    color: '#E50914',
    fontSize: 16,
    fontWeight: 'bold',
  },
});