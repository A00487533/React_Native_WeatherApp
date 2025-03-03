import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons'; // Ensure the icon library is imported correctly

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#000', // Black background for iOS
            height: 60, // Make sure the height is sufficient to display icons
          },
          default: {
            backgroundColor: '#000', // Black background for Android
            height: 60, // Same for Android
          },
        }),
      }}
    >
      {/* Home Screen with Ionicons */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} /> // Use Ionicons for the Home icon
          ),
        }}
      />

      {/* Explore Screen with Ionicons */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="compass" color={color} /> // Use Ionicons for the Explore icon
          ),
        }}
      />

      {/* Search Screen with Ionicons */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="search" color={color} /> // Use Ionicons for the Search icon
          ),
        }}
      />
    </Tabs>
  );
}
