import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectFlight, deleteFlight } from '../slices/flightsSlice';

const FlightDetail: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedFlight, loading } = useAppSelector((state) => state.flights);

  const handleClose = () => {
    dispatch(selectFlight(null));
  };

  const handleDelete = () => {
    if (selectedFlight) {
      dispatch(deleteFlight(selectedFlight.id));
      dispatch(selectFlight(null));
    }
  };

  if (!selectedFlight) {
    return null;
  }

  return (
    <div className="flight-detail">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flight-detail-content" onClick={handleClose}>
          <div className="detail-row">
            <span>Flight ID:</span>
            <span>{selectedFlight.id}</span>
          </div>
          <div className="detail-row">
            <span>Departure:</span>
            <span>{new Date(selectedFlight.departureTime).toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <span>Arrival:</span>
            <span>{new Date(selectedFlight.arrivalTime).toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <span>Price:</span>
            <span>${selectedFlight.price.toFixed(2)}</span>
          </div>
          <div className="flight-detail-actions">
            <button className="delete-button" onClick={handleDelete}>
              Delete Flight
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDetail; 