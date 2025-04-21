/**
 * Flight data model
 */
export interface Flight {
  /** Unique identifier for the flight */
  id: string;
  
  /** Origin city/airport */
  origin: string;
  
  /** Destination city/airport */
  destination: string;
  
  /** ISO string representation of departure time */
  departureTime: string;
  
  /** ISO string representation of arrival time */
  arrivalTime: string;
  
  /** Price in USD */
  price: number;
} 