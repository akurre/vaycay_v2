// src/types/index.d.ts

// GraphQL WeatherData type (matches server schema)
export interface WeatherData {
  city: string;
  country: string | null;
  state: string | null;
  suburb: string | null;
  date: string;
  lat: number | null;
  long: number | null;
  population: number | null;
  precipitation: number | null;
  snowDepth: number | null;
  avgTemperature: number | null;
  maxTemperature: number | null;
  minTemperature: number | null;
  stationName: string;
  submitterId: string | null;
}

// Legacy type for backward compatibility during migration
export interface CityWeatherData {
  long: string;
  lat: string;
  date: string;
  country: string;
  TAVG: number;
  TMIN: number;
  TMAX: number;
  name: string;
  city: string;
  PRCP: number;
  population: number;
  submitter_id: number | null;
}

// Helper to convert GraphQL data to legacy format (for gradual migration)
export function convertToLegacyFormat(data: WeatherData): CityWeatherData {
  return {
    long: String(data.long || 0),
    lat: String(data.lat || 0),
    date: data.date,
    country: data.country || '',
    TAVG: data.avgTemperature || 0,
    TMIN: data.minTemperature || 0,
    TMAX: data.maxTemperature || 0,
    name: data.stationName,
    city: data.city,
    PRCP: data.precipitation || 0,
    population: data.population || 0,
    submitter_id: data.submitterId ? parseInt(data.submitterId) : null,
  };
}

// Define a type for the API response when fetching weather data for a specific date
export interface WeatherApiResponse {
  weatherData: CityWeatherData[];
}
