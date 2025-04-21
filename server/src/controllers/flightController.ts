import { Request, Response } from 'express';
import dbClient from '../db/client';

// Get all flights
export const getFlights = async (req: Request, res: Response) => {
  try {
    const flights = await dbClient.findAll();
    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get flight by ID
export const getFlightById = async (req: Request, res: Response) => {
  try {
    const flight = await dbClient.findById(req.params.id);
    if (!flight) {
      res.status(404).json({ message: 'Flight not found' });
      return;
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
    const newFlight = await dbClient.create(req.body);
    if (!newFlight) {
      res.status(500).json({ message: 'Failed to create flight' });
      return;
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
    const updatedFlight = await dbClient.update(req.params.id, req.body);
    if (!updatedFlight) {
      res.status(404).json({ message: 'Flight not found' });
      return;
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
    const deletedFlight = await dbClient.delete(req.params.id);
    if (!deletedFlight) {
      res.status(404).json({ message: 'Flight not found' });
      return;
    }
    res.json(deletedFlight);
  } catch (error) {
    console.error('Error deleting flight:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 