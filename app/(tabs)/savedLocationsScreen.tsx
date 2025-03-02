import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { createTable, getLocations, deleteLocation } from '../../database/database';

function SavedLocationsScreen() {
  const [savedLocations, setSavedLocations] = useState<any>([]);

  useEffect(() => {
    createTable();
    fetchLocations();
   }, []);

   const fetchLocations = async () => {
    try {
      const locations = await getLocations();
      setSavedLocations(locations);
    } catch (error) {
      console.log('Failed to fetch locations:', error);
    }
  }; 

/*   const handleDelete = (id) => {
    Alert.alert('Remove Location', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: () => {
          deleteLocation(
            id,
            () => fetchLocations(), 
            (error) => console.log('Delete failed:', error)
          );
        },
      },
    ]);
  }; */

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Locations</Text>
{/* 
      {savedLocations.length === 0 ? (
        <Text>No saved locations yet.</Text>
      ) : (
        <FlatList
          data={savedLocations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.locationItem}>
              <Text style={styles.locationText}>{item.city}</Text>
              <Button
                title="Remove"
                // onPress={() => handleDelete(item.id)}
                color="red"
              />
            </View>
          )}
        />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  locationText: {
    fontSize: 16,
  },
});

export default SavedLocationsScreen;
