import express from 'express';
import { getFlights, getFlightById, createFlight, updateFlight, deleteFlight } from '../controllers/flightController';

const router = express.Router();

// GET all flights
router.get('/', getFlights);

// GET flight by ID
router.get('/:id', getFlightById);

// POST new flight
router.post('/', createFlight);

// PUT update flight
router.put('/:id', updateFlight);

// DELETE flight
router.delete('/:id', deleteFlight);

export default router; 