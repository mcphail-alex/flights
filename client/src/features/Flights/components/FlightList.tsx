import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFlights, selectFlight } from '../slices/flightsSlice';
import Flight from './Flight';
import { Flight as FlightType } from '../models/Flight';

const FlightList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { flights, loading, error } = useAppSelector((state) => state.flights);

  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);

  const handleFlightSelect = (flight: FlightType) => {
    dispatch(selectFlight(flight));
  };

  if (loading) return <div>Loading flights...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flight-list">
      <h2>Available Flights</h2>
      {flights.length === 0 ? (
        <p>No flights available</p>
      ) : (
        flights.map((flight) => (
          <Flight 
            key={flight.id} 
            flight={flight} 
            onSelect={handleFlightSelect}
          />
        ))
      )}
    </div>
  );
};

export default FlightList; 