import { useNavigate, useParams } from 'react-router-dom';
import { useWeatherByDate } from '../api/dates/useWeatherByDate';
import DateEntryForm from '../components/Navigation/dateNavigaton';
import WorldMap from '../components/Map/WorldMap';
import { FC } from 'react';


const DateWeatherPage: FC = () => {
  const { date } = useParams<{ date: string }>();
  const { dataReturned: weatherData, isError, isLoading } = useWeatherByDate(String(date));
  const navigate = useNavigate();
  const handleDateSubmit = (formattedDate: string) => {
    // Redirect to the new date
    navigate(`/day/${formattedDate}`);
  };

  if (isError) return <div>Failed to load weather data. </div>;
  console.log(isError)
  if (isLoading || !weatherData) return <div>Loading...</div>;

  return (
    <div className="w-full h-screen bg-gray-200 flex justify-center items-center">
      <div className="absolute inset-0 flex justify-center items-center z-10">
        <DateEntryForm onSubmit={handleDateSubmit} />
      </div>
      <div className='border border-2 border-solid border-red-500'>
      <div style={{ height: '95vh', width: '95vw' }}>
          <WorldMap cities={weatherData} />
        </div>
      </div>
    </div>
  );
};

export default DateWeatherPage;
