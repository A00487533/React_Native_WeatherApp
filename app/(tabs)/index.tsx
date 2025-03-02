import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

// Placeholder screens
function CurrentWeatherScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Current Location Weather</Text>
    </View>
  );
}

function SearchWeatherScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Search & Display Weather</Text>
    </View>
  );
}

function SavedLocationsScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text>Saved Locations</Text>
    </View>
  );
}

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Current Weather" component={CurrentWeatherScreen} />
      <Stack.Screen name="Search Weather" component={SearchWeatherScreen} />
      <Stack.Screen name="Saved Locations" component={SavedLocationsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
