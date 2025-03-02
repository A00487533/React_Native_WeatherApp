import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';

function searchWeatherScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch coordinates for the city
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError('City not found');
        setLoading(false);
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      // Fetch weather for the city
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Weather</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
      />
      <Button title="Get Weather" onPress={fetchWeather} />
      
      {loading && <ActivityIndicator size="large" />}
      {error && <Text style={styles.error}>{error}</Text>}
      
      {weather && (
        <View style={styles.weatherInfo}>
          <Text>Temperature: {weather.temperature}°C</Text>
          <Text>Wind Speed: {weather.windspeed} km/h</Text>
          <Text>Weather Code: {weather.weathercode}</Text>
          <Button title="Save Location" onPress={() => console.log('Save feature next!')} />
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
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  weatherInfo: {
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default searchWeatherScreen;
