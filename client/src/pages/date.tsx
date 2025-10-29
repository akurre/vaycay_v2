import { useNavigate, useParams } from 'react-router-dom';
import { useWeatherByDate } from '../api/dates/useWeatherByDate';
import DateEntryForm from '../components/Navigation/DateEntryForm';
import WorldMap, { ViewMode } from '../components/Map/WorldMap';
import MapViewToggle from '../components/Map/MapViewToggle';
import { FC, useState } from 'react';
import { Loader, Alert, Divider } from '@mantine/core';

const DateWeatherPage: FC = () => {
  const { date } = useParams<{ date: string }>();
  const { dataReturned: weatherData, isError, isLoading } = useWeatherByDate(String(date));
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('heatmap');

  const handleDateSubmit = (formattedDate: string) => {
    navigate(`/day/${formattedDate}`);
  };

  if (isError) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Alert color="red" title="Error">
          Failed to load weather data.
        </Alert>
      </div>
    );
  }

  if (isLoading || !weatherData) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-200">
      <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">
        <MapViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        <Divider my="md" />
        <DateEntryForm onSubmit={handleDateSubmit} currentDate={date} />
      </div>
      <div className="h-full w-full">
        <WorldMap cities={weatherData} viewMode={viewMode} />
      </div>
    </div>
  );
};

export default DateWeatherPage;
