import React, { useState } from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { students } from '../data/mockStudents';

export default function HomeScreen({ navigation }) {
  const [selectedClass, setSelectedClass] = useState('');
  const [attendance, setAttendance] = useState({});

  // handle checkbox
  const toggleAttendance = studentId => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  // save attendance
  const markAttendance = async () => {
    const user = auth().currentUser;

    if (!selectedClass) {
      Alert.alert('Select class first');
      return;
    }

    try {
      const batch = firestore().batch();

      const today = new Date().toISOString();

      students[selectedClass].forEach(student => {
        const ref = firestore().collection('attendance').doc();

        batch.set(ref, {
          teacherId: user.uid,
          studentId: student.id,
          studentName: student.name,
          class: selectedClass,
          status: attendance[student.id] ? 'Present' : 'Absent',
          date: today,
        });
      });

      await batch.commit();

      Alert.alert('Success', 'Attendance saved');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* 🔽 CLASS DROPDOWN */}
      <Text>Select Class</Text>
      <Picker
        selectedValue={selectedClass}
        onValueChange={value => setSelectedClass(value)}
      >
        <Picker.Item label="Select Class" value="" />
        <Picker.Item label="IX" value="IX" />
        <Picker.Item label="X" value="X" />
        <Picker.Item label="XI" value="XI" />
        <Picker.Item label="XII" value="XII" />
      </Picker>

      {/* 👨‍🎓 STUDENT LIST */}
      {selectedClass !== '' && (
        <FlatList
          data={students[selectedClass]}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 5,
              }}
            >
              <Text style={{ flex: 1 }}>{item.name}</Text>

              <Text>Present</Text>
              <CheckBox
                value={attendance[item.id] || false}
                onValueChange={() => toggleAttendance(item.id)}
              />
            </View>
          )}
        />
      )}

      <Button title="Save Attendance" onPress={markAttendance} />

      <Button
        title="View History"
        onPress={() => navigation.navigate('History')}
      />

      <Button
        title="Logout"
        onPress={async () => {
          await auth().signOut();
          navigation.replace('Login');
        }}
      />
    </View>
  );
}
