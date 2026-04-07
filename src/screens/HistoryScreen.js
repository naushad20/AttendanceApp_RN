import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';

export default function HistoryScreen() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (!user) return;

      const unsubscribeFirestore = firestore()
        .collection('attendance')
        .where('teacherId', '==', user.uid)
        .orderBy('date', 'desc')
        .onSnapshot(snapshot => {
          const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setData(list);
          setFilteredData(list);
        });

      return () => unsubscribeFirestore();
    });

    return () => unsubscribeAuth();
  }, []);

  // 🔥 FILTER LOGIC
  useEffect(() => {
    let temp = [...data];

    // filter by class
    if (selectedClass) {
      temp = temp.filter(item => item.class === selectedClass);
    }

    // filter by date (YYYY-MM-DD match)
    if (selectedDate) {
      temp = temp.filter(item => item.date?.startsWith(selectedDate));
    }

    setFilteredData(temp);
    setCurrentPage(1); // reset pagination
  }, [selectedClass, selectedDate, data]);

  // 🔥 Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // 📅 Format Date
  const formatDate = date => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* 🔽 FILTER SECTION */}
      <Text style={{ fontWeight: 'bold' }}>Filter by Class</Text>
      <Picker
        selectedValue={selectedClass}
        onValueChange={value => setSelectedClass(value)}
      >
        <Picker.Item label="All Classes" value="" />
        <Picker.Item label="IX" value="IX" />
        <Picker.Item label="X" value="X" />
        <Picker.Item label="XI" value="XI" />
        <Picker.Item label="XII" value="XII" />
      </Picker>

      <Text style={{ fontWeight: 'bold' }}>Filter by Date</Text>
      <TouchableOpacity
        onPress={() => {
          // simple example → set today's date
          const today = new Date().toISOString().split('T')[0];
          setSelectedDate(today);
        }}
        style={{
          padding: 10,
          backgroundColor: '#ddd',
          marginBottom: 10,
        }}
      >
        <Text>Select Today</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setSelectedDate('');
          setSelectedClass('');
        }}
        style={{
          padding: 10,
          backgroundColor: '#f99',
          marginBottom: 10,
        }}
      >
        <Text>Clear Filters</Text>
      </TouchableOpacity>

      {/* 📋 LIST */}
      <FlatList
        data={currentData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              marginBottom: 8,
              borderRadius: 8,
              backgroundColor: '#f2f2f2',
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>
              {item.studentName} ({item.class})
            </Text>

            <Text>{formatDate(item.date)}</Text>

            <Text
              style={{
                color: item.status === 'Present' ? 'green' : 'red',
                fontWeight: 'bold',
              }}
            >
              {item.status}
            </Text>
          </View>
        )}
      />

      {/* 🔢 PAGINATION */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <TouchableOpacity
            key={page}
            onPress={() => setCurrentPage(page)}
            style={{
              padding: 8,
              margin: 4,
              borderRadius: 5,
              backgroundColor: currentPage === page ? 'blue' : '#ccc',
            }}
          >
            <Text style={{ color: 'white' }}>{page}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
