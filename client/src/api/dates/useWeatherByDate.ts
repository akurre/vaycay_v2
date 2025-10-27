import { useQuery } from '@apollo/client/react';
import { GET_WEATHER_BY_DATE } from '../queries';
import { WeatherData, CityWeatherData, convertToLegacyFormat } from '../../types/cityWeatherDataType';

export function useWeatherByDate(date: string) {
  // Remove any dashes from the date format (e.g., "03-03" -> "0303")
  const formattedDate = date ? date.replaceAll('-', '') : '';
  
  // Using 'as any' to bypass Apollo Client v4's strict typing requirements
  const { data, loading, error } = useQuery(GET_WEATHER_BY_DATE, {
    variables: { monthDay: formattedDate },
    skip: !formattedDate || formattedDate.length !== 4,
  } as any); // TODO fix data typing

  // Convert to legacy format for backward compatibility
  let legacyData: CityWeatherData[] | undefined = undefined;
  
  if (data && (data as any).weatherByDate && Array.isArray((data as any).weatherByDate)) { // TODO FIX DATA TYPING
    legacyData = (data as any).weatherByDate.map((item: any) => convertToLegacyFormat(item as WeatherData)); // TODO FIX DATA TYPING
  }

  return {
    dataReturned: legacyData,
    isLoading: loading,
    isError: error,
  };
}
