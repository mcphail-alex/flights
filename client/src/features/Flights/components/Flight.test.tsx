import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import Flight from './Flight';
import { Flight as FlightType } from '../models/Flight';

describe('Flight Component', () => {
  const mockFlight: FlightType = {
    id: '1',
    origin: 'New York',
    destination: 'Los Angeles',
    departureTime: '2023-05-15T08:00:00Z',
    arrivalTime: '2023-05-15T11:00:00Z',
    price: 299.99
  };

  it('renders flight information correctly', () => {
    render(<Flight flight={mockFlight} />);
    
    expect(screen.getByText('New York to Los Angeles')).toBeInTheDocument();
    expect(screen.getByText(/Departure:/)).toBeInTheDocument();
    expect(screen.getByText(/Arrival:/)).toBeInTheDocument();
    expect(screen.getByText('$299.99')).toBeInTheDocument();
  });
}); 