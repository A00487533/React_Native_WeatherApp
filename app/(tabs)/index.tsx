import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

function weatherScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchWeather(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const data = await response.json();
      setWeather(data.current_weather);
    } catch (error) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#ff4c4c" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Current Location Weather</Text>
      <Text style={styles.weatherText}>Temperature: {weather.temperature}°C</Text>
      <Text style={styles.weatherText}>Wind Speed: {weather.windspeed} km/h</Text>
      <Text style={styles.weatherText}>Weather Code: {weather.weathercode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Black background for consistency
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // White header text
    marginBottom: 20,
    textAlign: 'center',
  },
  weatherText: {
    fontSize: 18,
    color: '#fff', // White text for weather details
    marginVertical: 5,
  },
  errorText: {
    color: '#ff4c4c', // Red text for errors
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default weatherScreen;
