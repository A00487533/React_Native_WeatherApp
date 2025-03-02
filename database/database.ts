import * as SQLite from 'expo-sqlite';
import type { WeatherData } from '@/types/weather';

const db = SQLite.openDatabaseAsync('locations.db');

export const createTable = async (): Promise<void> => {
  // Create the table if it doesn't exist
  const Database = await db;
  await Database.execAsync(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    );
  `);

  console.log('Database and table initialized successfully');
}

// Save a location
export const saveLocation = async (city: string): Promise<void> => {
  const Database = await db;
  
  // Corrected: Parameters need to be passed as an array
  const result = await Database.runAsync('INSERT INTO locations (name) VALUES (?);', [city]);
  console.log('Insert successful:', result);
}

// Get all saved locations
export const getLocations = async (): Promise<WeatherData[]> => {
  const Database = await db;
  const result = await Database.getAllAsync<WeatherData>('SELECT * FROM locations;');
  console.log('Locations fetched:', result);
  return result;
};

// Get the count of saved locations
export const getLocationCount = async (): Promise<string> => {
  const Database = await db;
  const result = await Database.getAllAsync<{ count: number }>('SELECT COUNT(*) AS count FROM locations;');
  return result[0].count.toString();
};

// Delete a location by ID
export const deleteLocation = async (id: number): Promise<void> => {
  const Database = await db;
  // Corrected: Parameters need to be passed as an array
  await Database.runAsync('DELETE FROM locations WHERE id = ?;', [id]);
  console.log('Location deleted:', id);
};