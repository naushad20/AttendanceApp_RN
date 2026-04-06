import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function HistoryScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const user = auth().currentUser;

    const subscriber = firestore()
      .collection('attendance')
      .where('userId', '==', user.uid)
      .orderBy('date', 'desc')
      .onSnapshot(querySnapshot => {
        const list = [];
        querySnapshot.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      });

    return () => subscriber();
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>{item.date}</Text>
          <Text>{item.status}</Text>
        </View>
      )}
    />
  );
}
