import React from 'react'
import './App.css'
import FlightList from '@/features/Flights/components/FlightList'
import FlightDetail from '@/features/Flights/components/FlightDetail'
import FlightForm from '@/features/Flights/components/FlightForm'
import { useAppSelector } from './store/hooks'

function App() {
  const { selectedFlight } = useAppSelector((state) => state.flights);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Fullstack Flights</h1>
      </header>
      <main>
        <FlightForm />
        <div className="content-container">
          <FlightList />
          {selectedFlight && <FlightDetail />}
        </div>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Fullstack Flights App</p>
      </footer>
    </div>
  )
}

export default App
