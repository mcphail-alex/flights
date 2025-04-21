# Fullstack Flights

A fullstack TypeScript application with a React frontend and Express backend for managing flight information.

## Project Structure

- **client**: React frontend built with TypeScript, Vite, and React Testing Library
- **server**: Express API backend built with TypeScript and Node.js

## Prerequisites

- Node.js (v16+)
- Yarn

## Setup

1. Install dependencies:

```bash
# Install root dependencies
yarn

# Install client dependencies
cd client && yarn

# Install server dependencies
cd server && yarn
```

2. Development:

```bash
# Run both client and server in development mode
yarn dev

# Run only client
yarn client

# Run only server
yarn server
```

3. Building:

```bash
# Build both client and server
yarn build

# Build only client
yarn build:client

# Build only server
yarn build:server
```

4. Production:

```bash
# Start the server in production mode
yarn start

# Start only the client
yarn start:client

# Start only the server
yarn start:server
```

## Testing

```bash
# Run client tests
cd client && yarn test

# Run server tests
cd server && yarn test
```

## Features

- **Frontend**:

  - React with TypeScript
  - Vite for fast development and building
  - Absolute imports with @ prefix
  - Testing with Vitest and React Testing Library

- **Backend**:
  - Node.js and Express with TypeScript
  - CORS enabled
  - Router for flight-related endpoints
  - Testing with Vitest

## API Endpoints

- `GET /flights` - Get all flights
- `GET /flights/:id` - Get a specific flight
- `POST /flights` - Create a new flight
- `PUT /flights/:id` - Update a flight
- `DELETE /flights/:id` - Delete a flight
