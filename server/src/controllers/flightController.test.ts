import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { getFlights, getFlightById, createFlight } from './flightController';
import { DbController } from './dbController';
import { Flight } from '../models/Flight';

// Mock the DbController
vi.mock('./dbController', () => ({
  DbController: {
    getAllFlights: vi.fn(),
    getFlightById: vi.fn(),
    addFlight: vi.fn(),
    updateFlight: vi.fn(),
    deleteFlight: vi.fn()
  }
}));

// Sample flight data for tests
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

// Mock objects
const mockRequest = () => {
  return {
    params: {},
    body: {}
  } as Partial<Request>;
};

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('Flight Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    vi.resetAllMocks();
  });

  it('should get all flights', async () => {
    // Setup mock
    vi.mocked(DbController.getAllFlights).mockResolvedValue(mockFlights);
    
    // Call the controller
    await getFlights(req as Request, res as Response);
    
    // Assertions
    expect(DbController.getAllFlights).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockFlights);
  });

  it('should get a flight by ID', async () => {
    // Setup mock
    req.params = { id: '1' };
    vi.mocked(DbController.getFlightById).mockResolvedValue(mockFlights[0]);
    
    // Call the controller
    await getFlightById(req as Request, res as Response);
    
    // Assertions
    expect(DbController.getFlightById).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(mockFlights[0]);
  });

  it('should return 404 for non-existent flight', async () => {
    // Setup mock
    req.params = { id: 'nonexistent' };
    vi.mocked(DbController.getFlightById).mockResolvedValue(null);
    
    // Call the controller
    await getFlightById(req as Request, res as Response);
    
    // Assertions
    expect(DbController.getFlightById).toHaveBeenCalledWith('nonexistent');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Flight not found' });
  });

  it('should create a new flight', async () => {
    // Setup mock
    const newFlightData: Omit<Flight, 'id'> = {
      origin: 'Boston',
      destination: 'Denver',
      departureTime: '2023-05-20T10:00:00Z',
      arrivalTime: '2023-05-20T13:00:00Z',
      price: 209.99
    };
    
    const createdFlight: Flight = {
      ...newFlightData,
      id: '3'
    };
    
    req.body = newFlightData;
    vi.mocked(DbController.addFlight).mockResolvedValue(createdFlight);
    
    // Call the controller
    await createFlight(req as Request, res as Response);
    
    // Assertions
    expect(DbController.addFlight).toHaveBeenCalledWith(newFlightData);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdFlight);
  });
}); 