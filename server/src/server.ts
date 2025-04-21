import express from 'express';
import cors from 'cors';
import flightRoutes from './routes/flightRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/flights', flightRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Flights API' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server; 