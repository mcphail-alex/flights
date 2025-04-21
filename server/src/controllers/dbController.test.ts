import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { DbController } from './dbController';
import { Flight } from '../models/Flight';

// Mock fs module
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    promises: {
      readFile: vi.fn(),
      writeFile: vi.fn().mockResolvedValue(undefined),
      mkdir: vi.fn().mockResolvedValue(undefined),
    },
    existsSync: vi.fn(),
  };
});

// Mock path.join
vi.mock('path', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    join: vi.fn().mockImplementation((...args) => {
      if (args[args.length - 1] === 'flights.json') {
        return '/mocked/path/flights.json';
      }
      return '/mocked/path';
    }),
  };
});

describe('DbController', () => {
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
    vi.mocked(fs.existsSync).mockImplementation((path) => {
      // Simulate that the data directory exists but check for file existence
      if (path === '/mocked/path') return true;
      if (path === '/mocked/path/flights.json') return true;
      return false;
    });
    vi.mocked(fs.promises.readFile).mockResolvedValue(JSON.stringify(mockFlights));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create data directory if it does not exist', async () => {
    // Simulate that the data directory does not exist
    vi.mocked(fs.existsSync).mockImplementation((path) => {
      if (path === '/mocked/path') return false;
      return true;
    });

    await DbController.getAllFlights();
    
    expect(fs.promises.mkdir).toHaveBeenCalledWith('/mocked/path', { recursive: true });
  });

  it('should get all flights', async () => {
    const flights = await DbController.getAllFlights();
    
    expect(fs.promises.readFile).toHaveBeenCalledWith('/mocked/path/flights.json', 'utf8');
    expect(flights).toEqual(mockFlights);
  });

  it('should create file if it does not exist', async () => {
    // Simulate that the file does not exist
    vi.mocked(fs.existsSync).mockImplementation((path) => {
      if (path === '/mocked/path') return true;
      if (path === '/mocked/path/flights.json') return false;
      return false;
    });
    
    const flights = await DbController.getAllFlights();
    
    expect(fs.promises.writeFile).toHaveBeenCalledWith('/mocked/path/flights.json', '[]');
    expect(flights).toEqual([]);
  });

  it('should get a flight by ID', async () => {
    const flight = await DbController.getFlightById('1');
    
    expect(flight).toEqual(mockFlights[0]);
  });

  it('should return null if flight ID not found', async () => {
    const flight = await DbController.getFlightById('999');
    
    expect(flight).toBeNull();
  });

  it('should add a new flight', async () => {
    const newFlight: Omit<Flight, 'id'> = {
      origin: 'Boston',
      destination: 'Denver',
      departureTime: '2023-05-20T10:00:00Z',
      arrivalTime: '2023-05-20T13:00:00Z',
      price: 209.99
    };
    
    // Mock Date.now() to return a consistent ID
    const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(1234567890);
    
    const result = await DbController.addFlight(newFlight);
    
    expect(result).toEqual({
      ...newFlight,
      id: '1234567890'
    });
    
    expect(fs.promises.writeFile).toHaveBeenCalled();
    
    // Verify the flights array was updated correctly in the write call
    const writeCall = vi.mocked(fs.promises.writeFile).mock.calls[0];
    const writtenData = JSON.parse(writeCall[1] as string);
    
    expect(writtenData).toHaveLength(3);
    expect(writtenData[2]).toEqual({
      ...newFlight,
      id: '1234567890'
    });
    
    dateSpy.mockRestore();
  });

  it('should update an existing flight', async () => {
    const updatedFlight: Omit<Flight, 'id'> = {
      origin: 'Updated Origin',
      destination: 'Updated Destination',
      departureTime: '2023-06-01T10:00:00Z',
      arrivalTime: '2023-06-01T13:00:00Z',
      price: 399.99
    };
    
    const result = await DbController.updateFlight('1', updatedFlight);
    
    expect(result).toEqual({
      ...updatedFlight,
      id: '1'
    });
    
    expect(fs.promises.writeFile).toHaveBeenCalled();
    
    // Verify the flights array was updated correctly in the write call
    const writeCall = vi.mocked(fs.promises.writeFile).mock.calls[0];
    const writtenData = JSON.parse(writeCall[1] as string);
    
    expect(writtenData).toHaveLength(2);
    expect(writtenData[0]).toEqual({
      ...updatedFlight,
      id: '1'
    });
  });

  it('should delete a flight', async () => {
    const result = await DbController.deleteFlight('1');
    
    expect(result).toEqual(mockFlights[0]);
    
    expect(fs.promises.writeFile).toHaveBeenCalled();
    
    // Verify the flights array was updated correctly in the write call
    const writeCall = vi.mocked(fs.promises.writeFile).mock.calls[0];
    const writtenData = JSON.parse(writeCall[1] as string);
    
    expect(writtenData).toHaveLength(1);
    expect(writtenData[0]).toEqual(mockFlights[1]);
  });
}); 