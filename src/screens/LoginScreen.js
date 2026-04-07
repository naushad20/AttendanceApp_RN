import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Enter email & password');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={{ padding: 40, marginTop: 100 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={login} />

      <View style={{ height: 10 }} />

      {/* 👉 Navigate instead of register */}
      <Button
        title="Go to Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}
