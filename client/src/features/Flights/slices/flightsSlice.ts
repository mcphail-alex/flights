import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Flight } from '../models/Flight';

interface FlightsState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
  selectedFlight: Flight | null;
}

const initialState: FlightsState = {
  flights: [],
  loading: false,
  error: null,
  selectedFlight: null,
};

// Async thunk for fetching flights
export const fetchFlights = createAsyncThunk(
  'flights/fetchFlights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/flights');
      if (!response.ok) {
        throw new Error('Failed to fetch flights');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Async thunk for fetching a single flight
export const fetchFlightById = createAsyncThunk(
  'flights/fetchFlightById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/flights/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch flight');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Async thunk for creating a flight
export const createFlight = createAsyncThunk(
  'flights/createFlight',
  async (flight: Omit<Flight, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flight),
      });
      if (!response.ok) {
        throw new Error('Failed to create flight');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Async thunk for updating a flight
export const updateFlight = createAsyncThunk(
  'flights/updateFlight',
  async (flight: Flight, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/flights/${flight.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flight),
      });
      if (!response.ok) {
        throw new Error('Failed to update flight');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Async thunk for deleting a flight
export const deleteFlight = createAsyncThunk(
  'flights/deleteFlight',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/flights/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete flight');
      }
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

export const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    selectFlight: (state, action: PayloadAction<Flight | null>) => {
      state.selectedFlight = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch flights
      .addCase(fetchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.flights = action.payload;
        state.loading = false;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch flight by id
      .addCase(fetchFlightById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlightById.fulfilled, (state, action) => {
        state.selectedFlight = action.payload;
        state.loading = false;
      })
      .addCase(fetchFlightById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create flight
      .addCase(createFlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlight.fulfilled, (state, action) => {
        state.flights.push(action.payload);
        state.loading = false;
      })
      .addCase(createFlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update flight
      .addCase(updateFlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlight.fulfilled, (state, action) => {
        const index = state.flights.findIndex((flight) => flight.id === action.payload.id);
        if (index !== -1) {
          state.flights[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateFlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete flight
      .addCase(deleteFlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFlight.fulfilled, (state, action) => {
        state.flights = state.flights.filter((flight) => flight.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteFlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectFlight, clearError } = flightsSlice.actions;

export default flightsSlice.reducer; 