import { useNavigate, useParams } from 'react-router-dom';
import { useWeatherByDate } from '../api/dates/useWeatherByDate';
import DateEntryForm from '../components/Navigation/dateNavigaton';
import WorldMap from '../components/Map/WorldMap';
import { FC } from 'react';
import { Loader, Alert } from '@mantine/core';

const DateWeatherPage: FC = () => {
  const { date } = useParams<{ date: string }>();
  const { dataReturned: weatherData, isError, isLoading } = useWeatherByDate(String(date));
  const navigate = useNavigate();
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
      <div className="absolute left-4 top-24 z-20">
        <DateEntryForm onSubmit={handleDateSubmit} currentDate={date} />
      </div>
      <div className="h-full w-full">
        <WorldMap cities={weatherData} />
      </div>
    </div>
  );
};

export default DateWeatherPage;
