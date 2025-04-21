import React from 'react'
import './App.css'
import FlightList from '@/features/Flights/components/FlightList'
import FlightForm from '@/features/Flights/components/FlightForm'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Fullstack Flights</h1>
      </header>
      <main>
        <FlightForm />
        <div className="content-container">
          <FlightList />
        </div>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Fullstack Flights App</p>
      </footer>
    </div>
  )
}

export default App
