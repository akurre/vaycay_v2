// src/types/index.d.ts

// Define a type for the weather data of a city
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
  
  // Define a type for the API response when fetching weather data for a specific date
  export interface WeatherApiResponse {
    weatherData: CityWeatherData[];
  }