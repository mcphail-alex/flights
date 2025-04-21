import React, { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { createFlight } from '../slices/flightsSlice';

interface FlightFormData {
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
}

const FlightForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FlightFormData>({
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const flight = {
      origin: formData.origin,
      destination: formData.destination,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      price: parseFloat(formData.price),
    };

    dispatch(createFlight(flight));
    
    // Reset form
    setFormData({
      origin: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
    });
    
    // Close form
    setIsOpen(false);
  };

  return (
    <div className="flight-form-container">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="add-flight-button">
          Add New Flight
        </button>
      ) : (
        <div className="flight-form">
          <h3>Add New Flight</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="origin">Origin:</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="destination">Destination:</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="departureTime">Departure Time:</label>
              <input
                type="datetime-local"
                id="departureTime"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="arrivalTime">Arrival Time:</label>
              <input
                type="datetime-local"
                id="arrivalTime"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">Save Flight</button>
              <button type="button" onClick={() => setIsOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FlightForm; 