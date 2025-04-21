import React from 'react';
import { Flight as FlightType } from '../models/Flight';

interface FlightProps {
  flight: FlightType;
  onSelect?: (flight: FlightType) => void;
}

export const Flight: React.FC<FlightProps> = ({ flight, onSelect }) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect(flight);
    }
  };

  return (
    <div className="flight-card" onClick={handleClick}>
      <h3>{flight.origin} to {flight.destination}</h3>
      <div className="flight-details">
        <p>Departure: {new Date(flight.departureTime).toLocaleString()}</p>
        <p>Arrival: {new Date(flight.arrivalTime).toLocaleString()}</p>
        <p className="price">${flight.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Flight; 