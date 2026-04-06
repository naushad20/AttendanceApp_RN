import React from 'react';
import { View, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function HomeScreen({ navigation }) {
  const markAttendance = async () => {
    const user = auth().currentUser;

    try {
      await firestore().collection('attendance').add({
        userId: user.uid,
        date: new Date().toISOString(),
        status: 'Present',
      });

      Alert.alert('Success', 'Attendance Marked');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const logout = async () => {
    await auth().signOut();
    navigation.replace('Login');
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Mark Attendance" onPress={markAttendance} />
      <Button
        title="View History"
        onPress={() => navigation.navigate('History')}
      />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
