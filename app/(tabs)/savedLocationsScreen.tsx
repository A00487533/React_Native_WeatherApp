import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { createTable, getLocations, deleteLocation } from '../../database/database';
import { useFocusEffect } from '@react-navigation/native';  // Import useFocusEffect

function SavedLocationsScreen() {
  const [savedLocations, setSavedLocations] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Using useFocusEffect to fetch locations when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const initialise = async () => {
        await createTable();
        await fetchLocations();
      }
      initialise();
      console.log('Initialising locations');
    }, [])  // Empty array means it runs only when the screen is focused
  );

  // Fetch saved locations and get weather for each
  const fetchLocations = async () => {
    setLoading(true);
    setError(null);

    try {
      const locations = await getLocations();

      const locationsWithWeather = await Promise.all(
        locations.map(async (location: any) => {
          const temp = await fetchTemperature(location.locationName);
          return { ...location, temperature: temp };
        })
      );

      setSavedLocations(locationsWithWeather);
    } catch (error) {
      console.log('Failed to fetch locations:', error);
      setError('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch temperature using geocoding and weather APIs
  const fetchTemperature = async (city: string) => {
    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        return 'City not found';
      }

      const { latitude, longitude } = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherResponse.json();

      return weatherData?.current_weather?.temperature 
        ? `${weatherData.current_weather.temperature}°C` 
        : 'N/A';
    } catch (error) {
      console.log(`Failed to fetch weather for ${city}:`, error);
      return 'Weather unavailable';
    }
  };

  // Handle delete action
  const handleDelete = async (id: number) => {
    Alert.alert('Remove Location', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          await deleteLocation(id);
          fetchLocations(); // Refresh list after deletion
        }
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Locations</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : savedLocations.length === 0 ? (
        <Text style={styles.noLocations}>No saved locations yet.</Text>
      ) : (
        <FlatList
          data={savedLocations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.locationItem}>
              <View>
                <Text style={styles.locationText}>{item.locationName}</Text>
                <Text style={styles.temperatureText}>Temp: {item.temperature}</Text>
              </View>
              <Button title="Remove" onPress={() => handleDelete(item.id)} color="#ff4c4c" />
            </View>
          )}
        />
      )}
    </View>
  );
}

// Styles for dark theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000', // Black background
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff', // White text
    textAlign: 'center',
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#ff4c4c',
    textAlign: 'center',
    marginTop: 20,
  },
  noLocations: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#444', // Dark gray border
  },
  locationText: {
    fontSize: 18,
    color: '#fff', // White text
  },
  temperatureText: {
    fontSize: 16,
    color: '#bbb', // Light gray text
  },
});

export default SavedLocationsScreen;
