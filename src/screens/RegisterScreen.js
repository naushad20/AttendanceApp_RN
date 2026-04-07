import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [className, setClassName] = useState('');

  const register = async () => {
    if (!email || !password || !className) {
      Alert.alert('Error', 'All fields required');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password,
      );

      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        email,
        class: className,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Account created');
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

      {/* 🔽 Dropdown */}
      <Text style={{ marginTop: 10 }}>Select Class</Text>
      <Picker
        selectedValue={className}
        onValueChange={itemValue => setClassName(itemValue)}
      >
        <Picker.Item label="Select Class" value="" />
        <Picker.Item label="IX" value="IX" />
        <Picker.Item label="X" value="X" />
        <Picker.Item label="XI" value="XI" />
        <Picker.Item label="XII" value="XII" />
      </Picker>

      <Button title="Create Account" onPress={register} />
    </View>
  );
}
