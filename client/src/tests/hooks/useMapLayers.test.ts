import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMapLayers } from '@/hooks/useMapLayers';
import type { WeatherData } from '@/types/cityWeatherDataType';

describe('useMapLayers', () => {
  const mockCities: WeatherData[] = [
    {
      city: 'Milan',
      country: 'Italy',
      state: null,
      suburb: null,
      date: '0615',
      lat: 45.4642,
      long: 9.19,
      population: 1000000,
      avgTemperature: 25.5,
      minTemperature: 20.0,
      maxTemperature: 30.0,
      precipitation: 10.5,
      snowDepth: null,
      stationName: 'Milan Station',
      submitterId: 'test-1',
    },
    {
      city: 'Rome',
      country: 'Italy',
      state: null,
      suburb: null,
      date: '0615',
      lat: 41.9028,
      long: 12.4964,
      population: 2000000,
      avgTemperature: 28.0,
      minTemperature: 22.0,
      maxTemperature: 34.0,
      precipitation: 5.0,
      snowDepth: null,
      stationName: 'Rome Station',
      submitterId: 'test-2',
    },
  ];

  it('returns an array of layers', () => {
    const { result } = renderHook(() => useMapLayers(mockCities, 'markers'));

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(1);
  });

  it('returns heatmap layer when viewMode is heatmap', () => {
    const { result } = renderHook(() => useMapLayers(mockCities, 'heatmap'));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('temperature-heatmap');
  });

  it('returns scatterplot layer when viewMode is markers', () => {
    const { result } = renderHook(() => useMapLayers(mockCities, 'markers'));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('city-markers');
  });

  it('handles empty cities array', () => {
    const { result } = renderHook(() => useMapLayers([], 'markers'));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('city-markers');
  });

  it('filters out cities with null coordinates in marker mode', () => {
    const citiesWithNulls: WeatherData[] = [
      ...mockCities,
      {
        city: 'Invalid',
        country: 'Italy',
        state: null,
        suburb: null,
        date: '0615',
        lat: null,
        long: null,
        population: null,
        avgTemperature: 25.0,
        minTemperature: 20.0,
        maxTemperature: 30.0,
        precipitation: 10.0,
        snowDepth: null,
        stationName: 'Invalid Station',
        submitterId: null,
      },
    ];

    const { result } = renderHook(() => useMapLayers(citiesWithNulls, 'markers'));

    expect(result.current).toHaveLength(1);
    // the layer should only include cities with valid coordinates
  });

  it('memoizes layers when inputs do not change', () => {
    const { result, rerender } = renderHook(
      ({ cities, viewMode }) => useMapLayers(cities, viewMode),
      {
        initialProps: { cities: mockCities, viewMode: 'markers' as const },
      }
    );

    const firstResult = result.current;
    rerender({ cities: mockCities, viewMode: 'markers' as const });
    const secondResult = result.current;

    // should return the same reference due to memoization
    expect(firstResult).toBe(secondResult);
  });

  it('updates layers when viewMode changes', () => {
    const { result, rerender } = renderHook(
      ({ cities, viewMode }) => useMapLayers(cities, viewMode),
      {
        initialProps: { cities: mockCities, viewMode: 'markers' as 'markers' | 'heatmap' },
      }
    );

    const markersLayer = result.current;
    expect(markersLayer[0].id).toBe('city-markers');

    rerender({ cities: mockCities, viewMode: 'heatmap' as 'markers' | 'heatmap' });

    const heatmapLayer = result.current;
    expect(heatmapLayer[0].id).toBe('temperature-heatmap');
  });

  it('updates layers when cities data changes', () => {
    const { result, rerender } = renderHook(
      ({ cities, viewMode }) => useMapLayers(cities, viewMode),
      {
        initialProps: { cities: mockCities, viewMode: 'markers' as const },
      }
    );

    const firstResult = result.current;

    const newCities: WeatherData[] = [
      {
        city: 'Florence',
        country: 'Italy',
        state: null,
        suburb: null,
        date: '0615',
        lat: 43.7696,
        long: 11.2558,
        population: 500000,
        avgTemperature: 26.0,
        minTemperature: 21.0,
        maxTemperature: 31.0,
        precipitation: 8.0,
        snowDepth: null,
        stationName: 'Florence Station',
        submitterId: 'test-3',
      },
    ];

    rerender({ cities: newCities, viewMode: 'markers' as const });

    const secondResult = result.current;
    // should be a different reference since cities changed
    expect(firstResult).not.toBe(secondResult);
  });
});
