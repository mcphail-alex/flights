import fs from 'fs';
import path from 'path';
import { Flight } from '../models/Flight';

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE_PATH = path.join(DATA_DIR, 'flights.json');

/**
 * Database controller for managing flight data
 */
export class DbController {
  /**
   * Ensure data directory exists
   * @private
   */
  private static async ensureDataDirectoryExists(): Promise<void> {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        await fs.promises.mkdir(DATA_DIR, { recursive: true });
        console.log(`Created data directory: ${DATA_DIR}`);
      }
    } catch (error) {
      console.error('Error creating data directory:', error);
      throw error;
    }
  }

  /**
   * Loads all flights from the data file
   * @returns Array of flight objects
   */
  static async getAllFlights(): Promise<Flight[]> {
    try {
      await this.ensureDataDirectoryExists();
      
      // Check if the file exists
      if (!fs.existsSync(DATA_FILE_PATH)) {
        // If not, create it with an empty array
        await fs.promises.writeFile(DATA_FILE_PATH, JSON.stringify([]));
        return [];
      }
      
      // Read the data file
      const data = await fs.promises.readFile(DATA_FILE_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading flights data:', error);
      return [];
    }
  }

  /**
   * Get a flight by ID
   * @param id Flight ID to find
   * @returns Flight object or null if not found
   */
  static async getFlightById(id: string): Promise<Flight | null> {
    try {
      const flights = await this.getAllFlights();
      return flights.find(flight => flight.id === id) || null;
    } catch (error) {
      console.error('Error finding flight:', error);
      return null;
    }
  }

  /**
   * Save all flights to the data file
   * @param flights Array of flight objects to save
   * @returns true if successful, false otherwise
   */
  static async saveFlights(flights: Flight[]): Promise<boolean> {
    try {
      await this.ensureDataDirectoryExists();
      
      await fs.promises.writeFile(
        DATA_FILE_PATH, 
        JSON.stringify(flights, null, 2)
      );
      return true;
    } catch (error) {
      console.error('Error saving flights data:', error);
      return false;
    }
  }

  /**
   * Add a new flight to the data file
   * @param flight Flight object to add (without ID)
   * @returns The added flight with ID or null if failed
   */
  static async addFlight(flight: Omit<Flight, 'id'>): Promise<Flight | null> {
    try {
      const flights = await this.getAllFlights();
      const newFlight: Flight = {
        ...flight,
        id: Date.now().toString()
      };
      
      flights.push(newFlight);
      await this.saveFlights(flights);
      
      return newFlight;
    } catch (error) {
      console.error('Error adding flight:', error);
      return null;
    }
  }

  /**
   * Update an existing flight
   * @param id Flight ID to update
   * @param updatedFlight Updated flight data
   * @returns The updated flight or null if not found or failed
   */
  static async updateFlight(id: string, updatedFlight: Omit<Flight, 'id'>): Promise<Flight | null> {
    try {
      const flights = await this.getAllFlights();
      const index = flights.findIndex(flight => flight.id === id);
      
      if (index === -1) {
        return null;
      }
      
      const updated: Flight = {
        ...updatedFlight,
        id
      };
      
      flights[index] = updated;
      await this.saveFlights(flights);
      
      return updated;
    } catch (error) {
      console.error('Error updating flight:', error);
      return null;
    }
  }

  /**
   * Delete a flight by ID
   * @param id Flight ID to delete
   * @returns The deleted flight or null if not found or failed
   */
  static async deleteFlight(id: string): Promise<Flight | null> {
    try {
      const flights = await this.getAllFlights();
      const index = flights.findIndex(flight => flight.id === id);
      
      if (index === -1) {
        return null;
      }
      
      const deletedFlight = flights[index];
      flights.splice(index, 1);
      
      await this.saveFlights(flights);
      
      return deletedFlight;
    } catch (error) {
      console.error('Error deleting flight:', error);
      return null;
    }
  }
} 