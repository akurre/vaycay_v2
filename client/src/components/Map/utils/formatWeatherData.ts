import { WeatherData } from '../../../types/cityWeatherDataType';

export interface WeatherDataItem {
  label: string;
  value: string;
}

type FieldConfig = {
  key: keyof WeatherData;
  label: string;
  format: (value: number) => string;
};

const fieldConfigs: FieldConfig[] = [
  {
    key: 'maxTemperature',
    label: 'Max Temp',
    format: (value) => `${value.toFixed(1)}°C`,
  },
  {
    key: 'minTemperature',
    label: 'Min Temp',
    format: (value) => `${value.toFixed(1)}°C`,
  },
  {
    key: 'avgTemperature',
    label: 'Average Temp',
    format: (value) => `${value.toFixed(1)}°C`,
  },
  {
    key: 'precipitation',
    label: 'Precipitation',
    format: (value) => `${value}cm`,
  },
  {
    key: 'population',
    label: 'Population',
    format: (value) => value.toLocaleString(),
  },
];

export function formatWeatherData(city: WeatherData): WeatherDataItem[] {
  return fieldConfigs
    .filter((config) => city[config.key] !== null)
    .map((config) => ({
      label: config.label,
      value: config.format(city[config.key] as number),
    }));
}
