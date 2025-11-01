import { FC, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import { Loader, Alert, Divider } from '@mantine/core';
import { useWeatherByDate } from '../api/dates/useWeatherByDate';
import DateEntryForm from '../components/Navigation/DateEntryForm';
import DateSlider from '../components/Navigation/DateSlider';
import WorldMap, { ViewMode } from '../components/Map/WorldMap';
import MapViewToggle from '../components/Map/MapViewToggle';
import { getTodayAsMMDD } from '@/utils/getTodayAsMMDD';

const MapPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlDate = searchParams.get('date');
  
  // initialize with today's date or url date
  const [selectedDate, setSelectedDate] = useState<string>(
    urlDate || getTodayAsMMDD()
  );
  const [viewMode, setViewMode] = useState<ViewMode>('heatmap');

  // debounce the date to avoid excessive api calls while dragging slider
  const [debouncedDate] = useDebouncedValue(selectedDate, 300);

  const { dataReturned: weatherData, isError, isLoading } = useWeatherByDate(debouncedDate);

  // update url when date changes (for bookmarking/sharing)
  useEffect(() => {
    setSearchParams({ date: selectedDate }, { replace: true });
  }, [selectedDate, setSearchParams]);

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  if (isError) { // todo handle errors better
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
        <Divider my="xs" />
        <DateSlider currentDate={selectedDate} onDateChange={handleDateChange} />
        <Divider my="xs" />
        <DateEntryForm onSubmit={handleDateChange} currentDate={selectedDate} />
      </div>

      {/* loading overlay */}
      {isLoading && (
        // todo handle black bg
        <div className="absolute inset-0 z-10 flex justify-center items-center bg-black bg-opacity-20">
          <Loader size="xl" />
        </div>
      )}

      {/* map */}
      <div className="h-full w-full">
        {weatherData && <WorldMap cities={weatherData} viewMode={viewMode} />}
      </div>
    </div>
  );
};

export default MapPage;
