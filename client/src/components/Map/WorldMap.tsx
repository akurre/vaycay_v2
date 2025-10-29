import { useState, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import type { MapViewState, PickingInfo } from '@deck.gl/core';
import { WeatherData } from '../../types/cityWeatherDataType';
import { transformToHeatmapData } from './utils/transformToHeatmapData';
import { getTooltipContent } from './utils/getTooltipContent';
import CityPopup from './CityPopup';
import 'maplibre-gl/dist/maplibre-gl.css';

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 0,
  latitude: 20,
  zoom: 2,
  pitch: 0,
  bearing: 0,
};

// Temperature color gradient: blue (cold) -> cyan -> green -> yellow -> orange -> red (hot)
const COLOR_RANGE: [number, number, number][] = [
  [0, 0, 255],      // Blue: coldest
  [0, 128, 255],    // Light blue
  [0, 255, 255],    // Cyan
  [0, 255, 128],    // Cyan-green
  [128, 255, 0],    // Yellow-green
  [255, 255, 0],    // Yellow
  [255, 128, 0],    // Orange
  [255, 0, 0],      // Red: hottest
];

export type ViewMode = 'heatmap' | 'markers';

interface WorldMapProps {
  cities: WeatherData[];
  viewMode: ViewMode;
}

function WorldMap({ cities, viewMode }: WorldMapProps) {
  const [selectedCity, setSelectedCity] = useState<WeatherData | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);

  const heatmapData = useMemo(() => transformToHeatmapData(cities), [cities]);

  // Get temperature range for marker coloring
  const { minTemp, maxTemp } = useMemo(() => {
    const temps = cities
      .filter((c) => c.avgTemperature !== null)
      .map((c) => c.avgTemperature!);
    return {
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
    };
  }, [cities]);

  const getMarkerColor = (temp: number): [number, number, number] => {
    if (maxTemp === minTemp) return [128, 128, 128];
    const normalized = (temp - minTemp) / (maxTemp - minTemp);
    const colorIndex = Math.floor(normalized * (COLOR_RANGE.length - 1));
    return COLOR_RANGE[Math.min(colorIndex, COLOR_RANGE.length - 1)];
  };

  const layers = [
    viewMode === 'heatmap'
      ? new HeatmapLayer({
          id: 'temperature-heatmap',
          data: heatmapData,
          getPosition: (d) => d.position,
          getWeight: (d) => d.weight,
          radiusPixels: 40,
          intensity: 0.5,
          threshold: 0.03,
          colorRange: COLOR_RANGE,
          aggregation: 'MEAN',
          opacity: 0.6,
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
        }),
  ];

  const handleHover = (info: PickingInfo) => {
    if (viewMode === 'markers' && info.object) {
      const city = info.object as WeatherData;
      setHoverInfo({
        x: info.x,
        y: info.y,
        content: getTooltipContent([city], city.long!, city.lat!)!,
      });
    } else if (viewMode === 'heatmap' && info.coordinate) {
      const [longitude, latitude] = info.coordinate;
      const content = getTooltipContent(cities, longitude, latitude);
      if (content) {
        setHoverInfo({
          x: info.x,
          y: info.y,
          content,
        });
      } else {
        setHoverInfo(null);
      }
    } else {
      setHoverInfo(null);
    }
  };

  const handleClick = (info: PickingInfo) => {
    if (viewMode === 'markers' && info.object) {
      setSelectedCity(info.object as WeatherData);
    } else if (viewMode === 'heatmap' && info.coordinate) {
      const [longitude, latitude] = info.coordinate;
      const city = cities.find(
        (c) =>
          c.lat !== null &&
          c.long !== null &&
          Math.abs(c.lat - latitude) < 0.5 &&
          Math.abs(c.long - longitude) < 0.5
      );
      if (city) {
        setSelectedCity(city);
      }
    }
  };

  return (
    <div className="relative h-full w-full">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={{
          dragPan: true,
          dragRotate: false,
          scrollZoom: true,
          touchZoom: true,
          touchRotate: false,
          keyboard: true,
          doubleClickZoom: true,
        }}
        layers={layers}
        onHover={handleHover}
        onClick={handleClick}
        getTooltip={() => null}
      >
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          attributionControl={false}
        />
      </DeckGL>

      {/* Tooltip */}
      {hoverInfo && (
        <div
          className="pointer-events-none absolute z-50 rounded bg-gray-900 px-3 py-2 text-sm text-white shadow-lg border border-gray-700"
          style={{
            left: hoverInfo.x + 10,
            top: hoverInfo.y + 10,
          }}
        >
          <div className="whitespace-pre-line">{hoverInfo.content}</div>
        </div>
      )}

      {/* Detailed Popup */}
      <CityPopup city={selectedCity} onClose={() => setSelectedCity(null)} />
    </div>
  );
}

export default WorldMap;
