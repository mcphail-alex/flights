import express, { RequestHandler } from 'express';
import { getFlights, getFlightById, createFlight, updateFlight, deleteFlight } from '../controllers/flightController';

const router = express.Router();

// GET all flights
router.get('/', getFlights as RequestHandler);

// GET flight by ID
router.get('/:id', getFlightById as RequestHandler);

// POST new flight
router.post('/', createFlight as RequestHandler);

// PUT update flight
router.put('/:id', updateFlight as RequestHandler);

// DELETE flight
router.delete('/:id', deleteFlight as RequestHandler);

export default router; 