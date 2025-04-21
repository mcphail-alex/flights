import fs from 'fs';
import path from 'path';
import { Flight } from '../models/Flight';

/**
 * Database client for persisting flight data
 */
class DbClient {
  private dataDir: string;
  private flightsFilePath: string;

  constructor() {
    this.dataDir = path.join(__dirname, '../data');
    this.flightsFilePath = path.join(this.dataDir, 'flights.json');
  }

  /**
   * Ensure the data directory exists
   * @private
   */
  private async ensureDataDirectoryExists(): Promise<void> {
    try {
      if (!fs.existsSync(this.dataDir)) {
        await fs.promises.mkdir(this.dataDir, { recursive: true });
        console.log(`Created data directory: ${this.dataDir}`);
      }
    } catch (error) {
      console.error('Error creating data directory:', error);
      throw error;
    }
  }

  /**
   * Find all flights in the database
   * @returns Array of Flight objects
   */
  async findAll(): Promise<Flight[]> {
    try {
      await this.ensureDataDirectoryExists();
      
      // Check if the file exists
      if (!fs.existsSync(this.flightsFilePath)) {
        // If not, create it with an empty array
        await fs.promises.writeFile(this.flightsFilePath, JSON.stringify([]));
        return [];
      }
      
      // Read the data file
      const data = await fs.promises.readFile(this.flightsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading flights data:', error);
      return [];
    }
  }

  /**
   * Find a flight by ID
   * @param id The flight ID to find
   * @returns Flight object or null if not found
   */
  async findById(id: string): Promise<Flight | null> {
    try {
      const flights = await this.findAll();
      return flights.find(flight => flight.id === id) || null;
    } catch (error) {
      console.error('Error finding flight:', error);
      return null;
    }
  }

  /**
   * Create a new flight
   * @param flight Flight data without ID
   * @returns Created flight with ID or null if failed
   */
  async create(flight: Omit<Flight, 'id'>): Promise<Flight | null> {
    try {
      const flights = await this.findAll();
      const newFlight: Flight = {
        ...flight,
        id: Date.now().toString(),
      };
      
      flights.push(newFlight);
      await this.saveFlights(flights);
      
      return newFlight;
    } catch (error) {
      console.error('Error creating flight:', error);
      return null;
    }
  }

  /**
   * Update an existing flight
   * @param id Flight ID to update
   * @param data Updated flight data
   * @returns Updated flight or null if not found/failed
   */
  async update(id: string, data: Omit<Flight, 'id'>): Promise<Flight | null> {
    try {
      const flights = await this.findAll();
      const index = flights.findIndex(flight => flight.id === id);
      
      if (index === -1) {
        return null;
      }
      
      const updatedFlight: Flight = {
        ...data,
        id,
      };
      
      flights[index] = updatedFlight;
      await this.saveFlights(flights);
      
      return updatedFlight;
    } catch (error) {
      console.error('Error updating flight:', error);
      return null;
    }
  }

  /**
   * Delete a flight by ID
   * @param id Flight ID to delete
   * @returns Deleted flight or null if not found/failed
   */
  async delete(id: string): Promise<Flight | null> {
    try {
      const flights = await this.findAll();
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

  /**
   * Save flights to the data file
   * @private
   * @param flights Array of flights to save
   */
  private async saveFlights(flights: Flight[]): Promise<boolean> {
    try {
      await this.ensureDataDirectoryExists();
      
      await fs.promises.writeFile(
        this.flightsFilePath,
        JSON.stringify(flights, null, 2)
      );
      return true;
    } catch (error) {
      console.error('Error saving flights data:', error);
      return false;
    }
  }
}

// Create and export a singleton instance of the database client
const dbClient = new DbClient();
export default dbClient; 