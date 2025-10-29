import { useMemo } from 'react';
import { WeatherData } from '../../../types/cityWeatherDataType';

export const useTemperatureRange = (cities: WeatherData[]) => {
  return useMemo(() => {
    const temps = cities
      .filter((c) => c.avgTemperature !== null)
      .map((c) => c.avgTemperature!);
    return {
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
    };
  }, [cities]);
};
