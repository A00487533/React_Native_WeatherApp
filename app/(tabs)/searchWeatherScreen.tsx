import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { saveLocation, createTable, getLocationCount } from '@/database/database';
import { useFocusEffect } from '@react-navigation/native';  // Import useFocusEffect

function searchWeatherScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [locationcount, setLocationCount] = useState<Number>(0);



  useFocusEffect(
      React.useCallback(() => {
        const initialise = async () => {
          await createTable();
          await fetchLocations();
      }
      console.log('Initialising database');
      initialise();
      }, [])  // Empty array means it runs only when the screen is focused
    );


  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError('City not found');
        setLoading(false);
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherResponse.json();
      setWeather(weatherData.current_weather);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const savedLocations = await getLocationCount();
      setLocationCount(savedLocations);
    } catch (error) {
      console.error('Fetch locations error:', error);
    }
  };

  const handleSaveLocation = async () => {
    try{
      if (city) {
        await saveLocation(city);
        alert('Location saved!');
      }
    } catch (error) {
      console.log('Failed to save location:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Weather</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        placeholderTextColor="#888"
        value={city}
        onChangeText={setCity}
      />
      <Button title="Get Weather" onPress={fetchWeather} color="#1e90ff" />

      {loading && <ActivityIndicator size="large" color="#1e90ff" />}
      {error && <Text style={styles.error}>{error}</Text>}

      {weather && (
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherText}>Temperature: {weather.temperature}°C</Text>
          <Text style={styles.weatherText}>Wind Speed: {weather.windspeed} km/h</Text>
          <Text style={styles.weatherText}>Weather Code: {weather.weathercode}</Text>
          <Button title="Save Location" disabled={locationcount == 4 || city.trim() === ''} onPress={handleSaveLocation} color="#32cd32" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#000', // Black background to maintain consistency
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // White text for the header
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#444',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#fff', // White text inside the input field
  },
  weatherInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333', // Dark background for the weather info box
    borderRadius: 5,
  },
  weatherText: {
    fontSize: 18,
    color: '#fff', // White text for weather information
    marginVertical: 5,
  },
  error: {
    color: '#ff4c4c', // Red text for errors
    marginTop: 10,
    textAlign: 'center',
  },
});

export default searchWeatherScreen;
