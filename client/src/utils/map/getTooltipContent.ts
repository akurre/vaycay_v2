import { WeatherData } from '../../types/cityWeatherDataType';
import { formatTemperature } from '../tempFormatting/formatTemperature';

/**
 * Finds the city data for a given coordinate position
 * Used for displaying tooltip information on hover
 */
export const getTooltipContent = (
  cities: WeatherData[],
  longitude: number,
  latitude: number
): string | null => {
  // Find city within a small radius (approximately 50km at equator)
  const TOLERANCE = 0.5;

  const city = cities.find(
    (c) =>
      c.lat !== null &&
      c.long !== null &&
      Math.abs(c.lat - latitude) < TOLERANCE &&
      Math.abs(c.long - longitude) < TOLERANCE
  );

  if (!city || city.avgTemperature === null) {
    return null;
  }

  return `${city.city}, ${city.country || 'Unknown'}
${formatTemperature(city.avgTemperature)}`;
};
