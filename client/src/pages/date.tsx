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
    <div className="w-full h-screen bg-gray-200 flex justify-center items-center">
      <div className="absolute inset-0 flex justify-center items-center z-10">
        <DateEntryForm onSubmit={handleDateSubmit} />
      </div>
      <div className="border-2 border-solid border-red-500">
        <div style={{ height: '95vh', width: '95vw' }}>
          <WorldMap cities={weatherData} />
        </div>
      </div>
    </div>
  );
};

export default DateWeatherPage;
