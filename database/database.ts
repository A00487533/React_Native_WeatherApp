import * as SQLite from 'expo-sqlite';
import type { WeatherData } from '@/types/weather';
const db = SQLite.openDatabaseAsync('locations.db');

export const createTable = async () => {

  try{

    const Database = await db;
    await Database.execAsync(`
      CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        locationName TEXT,
        weatherCondition TEXT
        ); 


        `);
      } catch (error) {
        console.log('Failed to create table:', error);
      }

};

// Save a location with weather condition
export const saveLocation = async (city: string): Promise<void> => {
  console.log('Saving location:', city);
  const Database = await db;

  const result = await Database.prepareAsync(
    'INSERT INTO locations (locationName) VALUES ($loc);');
  await result.executeAsync({ $loc: city });
  console.log('Insert successful:', result);
  return;
};

// Get all saved locations
export const getLocations = async (): Promise<WeatherData[]> => {
  const Database = await db;
  const result = await Database.getAllAsync<WeatherData>('SELECT * FROM locations;');
  console.log('Locations fetched:', result);
  return result;
};

// Get the count of saved locations
export const getLocationCount = async (): Promise<number> => {
  const Database = await db;
  const result = await Database.getAllAsync<{ count: number }>('SELECT COUNT(*) AS count FROM locations;');
  console.log('Location count:', result[0].count);
  
  return result[0].count;
};

// Delete a location by ID
export const deleteLocation = async (id: number): Promise<void> => {
  const Database = await db;
  await Database.runAsync('DELETE FROM locations WHERE id = ?;', [id]);
  console.log('Location deleted:', id);
};
