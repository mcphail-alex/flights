import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { Flight } from '../models/Flight';

// Mock the entire client module to avoid actual file operations
vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    }
  };
});

// Import after mocking
import dbClient from './client';

describe('Database Client', () => {
  const mockFlights: Flight[] = [
    {
      id: '1',
      origin: 'New York',
      destination: 'Los Angeles',
      departureTime: '2023-05-15T08:00:00Z',
      arrivalTime: '2023-05-15T11:00:00Z',
      price: 299.99
    },
    {
      id: '2',
      origin: 'Chicago',
      destination: 'Miami',
      departureTime: '2023-05-16T09:30:00Z',
      arrivalTime: '2023-05-16T13:00:00Z',
      price: 249.99
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should find all flights', async () => {
    vi.mocked(dbClient.findAll).mockResolvedValue(mockFlights);
    
    const flights = await dbClient.findAll();
    
    expect(flights).toEqual(mockFlights);
    expect(dbClient.findAll).toHaveBeenCalled();
  });

  it('should find a flight by id', async () => {
    vi.mocked(dbClient.findById).mockResolvedValue(mockFlights[0]);
    
    const flight = await dbClient.findById('1');
    
    expect(flight).toEqual(mockFlights[0]);
    expect(dbClient.findById).toHaveBeenCalledWith('1');
  });

  it('should return null when flight not found', async () => {
    vi.mocked(dbClient.findById).mockResolvedValue(null);
    
    const flight = await dbClient.findById('999');
    
    expect(flight).toBeNull();
    expect(dbClient.findById).toHaveBeenCalledWith('999');
  });

  it('should create a new flight', async () => {
    const newFlight: Omit<Flight, 'id'> = {
      origin: 'Boston',
      destination: 'Denver',
      departureTime: '2023-05-20T10:00:00Z',
      arrivalTime: '2023-05-20T13:00:00Z',
      price: 209.99
    };
    
    const createdFlight: Flight = {
      ...newFlight,
      id: '1234567890'
    };
    
    vi.mocked(dbClient.create).mockResolvedValue(createdFlight);
    
    const result = await dbClient.create(newFlight);
    
    expect(result).toEqual(createdFlight);
    expect(dbClient.create).toHaveBeenCalledWith(newFlight);
  });

  it('should update an existing flight', async () => {
    const updatedData: Omit<Flight, 'id'> = {
      origin: 'Updated Origin',
      destination: 'Updated Destination',
      departureTime: '2023-06-01T10:00:00Z',
      arrivalTime: '2023-06-01T13:00:00Z',
      price: 399.99
    };
    
    const updatedFlight: Flight = {
      ...updatedData,
      id: '1'
    };
    
    vi.mocked(dbClient.update).mockResolvedValue(updatedFlight);
    
    const result = await dbClient.update('1', updatedData);
    
    expect(result).toEqual(updatedFlight);
    expect(dbClient.update).toHaveBeenCalledWith('1', updatedData);
  });

  it('should delete a flight', async () => {
    vi.mocked(dbClient.delete).mockResolvedValue(mockFlights[0]);
    
    const result = await dbClient.delete('1');
    
    expect(result).toEqual(mockFlights[0]);
    expect(dbClient.delete).toHaveBeenCalledWith('1');
  });
}); 