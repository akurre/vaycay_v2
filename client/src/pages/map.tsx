import { FC, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import { Alert, Divider } from '@mantine/core';
import { useWeatherByDate } from '../api/dates/useWeatherByDate';
import DateSlider from '../components/Navigation/DateSlider';
import WorldMap, { ViewMode } from '../components/Map/WorldMap';
import MapViewToggle from '../components/Map/MapViewToggle';
import { getTodayAsMMDD } from '@/utils/dateFormatting/getTodayAsMMDD';
import { useWeatherStore } from '../stores/useWeatherStore';

const MapPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlDate = searchParams.get('date');

  // initialize with today's date or url date
  const [selectedDate, setSelectedDate] = useState<string>(urlDate || getTodayAsMMDD());
  const [viewMode, setViewMode] = useState<ViewMode>('heatmap');

  // debounce the date to avoid excessive api calls while dragging slider
  const [debouncedDate] = useDebouncedValue(selectedDate, 300);

  const { dataReturned: weatherData, isError, isLoading } = useWeatherByDate(debouncedDate);

  // zustand store for persisting displayed data
  const { displayedWeatherData, setDisplayedWeatherData, setIsLoadingWeather } = useWeatherStore();

  // update url when date changes (for bookmarking/sharing)
  useEffect(() => {
    setSearchParams({ date: selectedDate }, { replace: true });
  }, [selectedDate, setSearchParams]);

  // update store when weather data changes
  useEffect(() => {
    setIsLoadingWeather(isLoading);

    if (weatherData && !isLoading) {
      setDisplayedWeatherData(weatherData);
    }
  }, [weatherData, isLoading, setDisplayedWeatherData, setIsLoadingWeather]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  if (isError) {
    // todo handle errors better
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Alert color="red" title="Error">
          Failed to load weather data.
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-200">
      {/* todo handle darkmode / theming better (use mantine theme) */}
      {/* navigation panel */}
      {/* todo handle white bg */}
      <div className="absolute left-4 top-4 z-20 flex flex-col gap-2 bg-white p-4 rounded-lg shadow-lg max-w-md">
        <MapViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>
      <div className='absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30' style={{ width: 'calc(100% - 16rem)', maxWidth: '56rem' }}>
        <DateSlider currentDate={selectedDate} onDateChange={handleDateChange} />
      </div>
      {/* map */}
      <div className="h-full w-full">
        {displayedWeatherData && <WorldMap cities={displayedWeatherData} viewMode={viewMode} />}
      </div>
    </div>
  );
};

export default MapPage;
