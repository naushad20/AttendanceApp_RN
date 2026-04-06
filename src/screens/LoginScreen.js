import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const register = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await auth().createUserWithEmailAndPassword(email.trim(), password);
      Alert.alert('Success', 'Account created');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={{ padding: 40, marginTop: 100 }}>
      <TextInput
        placeholder="Email"
        placeholderTextColor={'blue'}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={'blue'}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={login} />
      <View style={{ height: 10 }} />
      <Button title="Register" onPress={register} />
    </View>
  );
}
