import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWeatherStore } from '../../stores/useWeatherStore';
import type { WeatherData } from '../../types/cityWeatherDataType';

describe('useWeatherStore', () => {
  beforeEach(() => {
    // reset store state before each test
    const { setState } = useWeatherStore;
    setState({
      displayedWeatherData: null,
      isLoadingWeather: false,
    });
  });

  it('initializes with null data and not loading', () => {
    const { result } = renderHook(() => useWeatherStore());

    expect(result.current.displayedWeatherData).toBeNull();
    expect(result.current.isLoadingWeather).toBe(false);
  });

  it('sets displayed weather data', () => {
    const { result } = renderHook(() => useWeatherStore());

    const mockData: WeatherData[] = [
      {
        city: 'Milan',
        country: 'Italy',
        lat: 45.4642,
        long: 9.19,
        avgTemperature: 25.5,
        minTemperature: 20.0,
        maxTemperature: 30.0,
        precipitation: 10.5,
        snowDepth: null,
        windSpeed: 5.2,
        cloudCover: 50,
      },
    ];

    act(() => {
      result.current.setDisplayedWeatherData(mockData);
    });

    expect(result.current.displayedWeatherData).toEqual(mockData);
  });

  it('sets loading state to true', () => {
    const { result } = renderHook(() => useWeatherStore());

    act(() => {
      result.current.setIsLoadingWeather(true);
    });

    expect(result.current.isLoadingWeather).toBe(true);
  });

  it('sets loading state to false', () => {
    const { result } = renderHook(() => useWeatherStore());

    act(() => {
      result.current.setIsLoadingWeather(true);
    });

    act(() => {
      result.current.setIsLoadingWeather(false);
    });

    expect(result.current.isLoadingWeather).toBe(false);
  });

  it('clears weather data by setting to null', () => {
    const { result } = renderHook(() => useWeatherStore());

    const mockData: WeatherData[] = [
      {
        city: 'Rome',
        country: 'Italy',
        lat: 41.9028,
        long: 12.4964,
        avgTemperature: 28.0,
        minTemperature: 22.0,
        maxTemperature: 34.0,
        precipitation: 5.0,
        snowDepth: null,
        windSpeed: 3.5,
        cloudCover: 30,
      },
    ];

    act(() => {
      result.current.setDisplayedWeatherData(mockData);
    });

    act(() => {
      result.current.setDisplayedWeatherData(null);
    });

    expect(result.current.displayedWeatherData).toBeNull();
  });

  it('handles multiple weather data entries', () => {
    const { result } = renderHook(() => useWeatherStore());

    const mockData: WeatherData[] = [
      {
        city: 'Milan',
        country: 'Italy',
        lat: 45.4642,
        long: 9.19,
        avgTemperature: 25.5,
        minTemperature: 20.0,
        maxTemperature: 30.0,
        precipitation: 10.5,
        snowDepth: null,
        windSpeed: 5.2,
        cloudCover: 50,
      },
      {
        city: 'Rome',
        country: 'Italy',
        lat: 41.9028,
        long: 12.4964,
        avgTemperature: 28.0,
        minTemperature: 22.0,
        maxTemperature: 34.0,
        precipitation: 5.0,
        snowDepth: null,
        windSpeed: 3.5,
        cloudCover: 30,
      },
    ];

    act(() => {
      result.current.setDisplayedWeatherData(mockData);
    });

    expect(result.current.displayedWeatherData).toHaveLength(2);
    expect(result.current.displayedWeatherData?.[0].city).toBe('Milan');
    expect(result.current.displayedWeatherData?.[1].city).toBe('Rome');
  });
});
