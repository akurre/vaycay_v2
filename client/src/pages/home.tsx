import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import DateEntryForm from '../components/Navigation/dateNavigaton';


const Home: FC = () => {
  const navigate = useNavigate();
  const handleDateSubmit = (formattedDate: string) => {
    // Redirect to the new date
    navigate(`/day/${formattedDate}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        {/* TODO make these components */}
        <h1 className="text-6xl font-bold"> 
          Welcome to the <span className="text-blue-600">Weather App</span>
        </h1>

        <p className="mt-3 text-2xl">
          Get historical weather data by selecting a date.
        </p>

        <p className="mt-3 text-sm">
          By the way this is super duper in progress. Come back later for more.
        </p>

        <DateEntryForm onSubmit={handleDateSubmit} />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
      <Home />
  );
};

export default App;
