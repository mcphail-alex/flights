import { Request, Response } from 'express';
import { DbController } from './dbController';

// Get all flights
export const getFlights = async (req: Request, res: Response) => {
  try {
    const flights = await DbController.getAllFlights();
    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get flight by ID
export const getFlightById = async (req: Request, res: Response) => {
  try {
    const flight = await DbController.getFlightById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    console.error('Error fetching flight:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new flight
export const createFlight = async (req: Request, res: Response) => {
  try {
    const newFlight = await DbController.addFlight(req.body);
    if (!newFlight) {
      return res.status(500).json({ message: 'Failed to create flight' });
    }
    res.status(201).json(newFlight);
  } catch (error) {
    console.error('Error creating flight:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a flight
export const updateFlight = async (req: Request, res: Response) => {
  try {
    const updatedFlight = await DbController.updateFlight(req.params.id, req.body);
    if (!updatedFlight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(updatedFlight);
  } catch (error) {
    console.error('Error updating flight:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a flight
export const deleteFlight = async (req: Request, res: Response) => {
  try {
    const deletedFlight = await DbController.deleteFlight(req.params.id);
    if (!deletedFlight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(deletedFlight);
  } catch (error) {
    console.error('Error deleting flight:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 