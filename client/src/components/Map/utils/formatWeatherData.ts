import { WeatherData } from '../../../types/cityWeatherDataType';

export interface WeatherDataItem {
  label: string;
  value: string;
}

export function formatWeatherData(city: WeatherData): WeatherDataItem[] {
  const items: WeatherDataItem[] = [];

  if (city.maxTemperature !== null) {
    items.push({
      label: 'Max Temp',
      value: `${city.maxTemperature.toFixed(1)}°C`,
    });
  }

  if (city.minTemperature !== null) {
    items.push({
      label: 'Min Temp',
      value: `${city.minTemperature.toFixed(1)}°C`,
    });
  }

  if (city.avgTemperature !== null) {
    items.push({
      label: 'Average Temp',
      value: `${city.avgTemperature.toFixed(1)}°C`,
    });
  }

  if (city.precipitation !== null) {
    items.push({
      label: 'Precipitation',
      value: `${city.precipitation}cm`,
    });
  }

  if (city.population !== null) {
    items.push({
      label: 'Population',
      value: city.population.toLocaleString(),
    });
  }

  return items;
}
