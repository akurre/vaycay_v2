import { useMemo } from 'react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { WeatherData } from '../types/cityWeatherDataType';
import { transformToHeatmapData } from '../utils/map/transformToHeatmapData';
import { getMarkerColor, COLOR_RANGE } from '../utils/map/getMarkerColor';
import type { ViewMode } from '../components/Map/WorldMap';

export const useMapLayers = (cities: WeatherData[], viewMode: ViewMode) => {
  const heatmapData = useMemo(() => transformToHeatmapData(cities), [cities]);

  return useMemo(() => {
    return [
      viewMode === 'heatmap'
        ? new HeatmapLayer({
            id: 'temperature-heatmap',
            data: heatmapData,
            getPosition: (d) => d.position,
            getWeight: (d) => d.weight,
            radiusPixels: 40,
            intensity: 1,
            threshold: 0.03,
            colorRange: COLOR_RANGE,
            aggregation: 'MEAN',
            opacity: 0.6,
            transitions: {
              getWeight: {
                duration: 500,
                easing: (t: number) => t * (2 - t),
              },
            },
          })
        : new ScatterplotLayer({
            id: 'city-markers',
            data: cities.filter(
              (c) => c.lat !== null && c.long !== null && c.avgTemperature !== null
            ),
            getPosition: (d) => [d.long!, d.lat!],
            getFillColor: (d) => getMarkerColor(d.avgTemperature!),
            getRadius: 50000,
            radiusMinPixels: 3,
            radiusMaxPixels: 8,
            pickable: true,
            opacity: 0.8,
            transitions: {
              getFillColor: {
                duration: 500,
                easing: (t: number) => t * (2 - t),
              },
            },
          }),
    ];
  }, [cities, viewMode, heatmapData]);
};
