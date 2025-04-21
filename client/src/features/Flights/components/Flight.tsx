import React, { useState } from 'react';
import { Flight as FlightType } from '../models/Flight';
import FlightDetail from './FlightDetail';

interface FlightProps {
  flight: FlightType;
  onSelect?: (flight: FlightType) => void;
}

export const Flight: React.FC<FlightProps> = ({ flight, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
    if (onSelect) {
      onSelect(flight);
    }
  };

  return (
    <div className="flight-card">
      <div className="flight-header" onClick={handleClick}>
        <h3>{flight.origin} to {flight.destination}</h3>
      </div>
      
      {expanded && (
        <FlightDetail />
      )}
    </div>
  );
};

export default Flight; 