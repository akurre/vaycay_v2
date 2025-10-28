import { WeatherData } from '../../../types/cityWeatherDataType';

export function hasCoords(
  city: WeatherData
): city is WeatherData & { lat: number; long: number } {
  return city.lat !== null && city.long !== null;
}
