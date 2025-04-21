import { configureStore } from '@reduxjs/toolkit';
import flightsReducer from '@/features/Flights/slices/flightsSlice';

export const store = configureStore({
  reducer: {
    flights: flightsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 