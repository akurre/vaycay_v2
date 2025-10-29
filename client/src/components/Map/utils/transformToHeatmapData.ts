import { WeatherData } from '../../../types/cityWeatherDataType';

export interface HeatmapDataPoint {
  position: [number, number];
  weight: number;
}

/**
 * Transforms weather data into format suitable for Deck.gl HeatmapLayer
 * Filters out cities without coordinates and normalizes temperature values
 * Uses actual min/max from the dataset for better visualization
 */
export const transformToHeatmapData = (cities: WeatherData[]): HeatmapDataPoint[] => {
  const validCities = cities.filter(
    (city) => city.lat !== null && city.long !== null && city.avgTemperature !== null
  );

  if (validCities.length === 0) {
    return [];
  }

  // Calculate actual min and max temperatures from the dataset
  const temperatures = validCities.map((city) => city.avgTemperature!);
  const minTemp = Math.min(...temperatures);
  const maxTemp = Math.max(...temperatures);

  // Add padding to the range for better visualization
  const tempRange = maxTemp - minTemp;
  const paddedMin = minTemp - tempRange * 0.1;
  const paddedMax = maxTemp + tempRange * 0.1;

  return validCities.map((city) => ({
    position: [city.long!, city.lat!] as [number, number],
    weight: normalizeTemperature(city.avgTemperature!, paddedMin, paddedMax),
  }));
};

/**
 * Normalizes temperature to a 0-1 scale based on actual data range
 */
const normalizeTemperature = (tempCelsius: number, minTemp: number, maxTemp: number): number => {
  if (maxTemp === minTemp) {
    return 0.5; // If all temperatures are the same, use middle value
  }

  // Clamp temperature to expected range
  const clampedTemp = Math.max(minTemp, Math.min(maxTemp, tempCelsius));

  // Normalize to 0-1 range
  return (clampedTemp - minTemp) / (maxTemp - minTemp);
};
