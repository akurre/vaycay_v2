import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Text } from '@mantine/core';
import DateEntryForm from '../components/Navigation/dateNavigaton';

const Home: FC = () => {
  const navigate = useNavigate();
  const handleDateSubmit = (formattedDate: string) => {
    navigate(`/day/${formattedDate}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <Title order={1} size="3.75rem" fw={700}>
          Welcome to the <span className="text-blue-600">Weather App</span>
        </Title>

        <Text size="xl" mt="md">
          Get historical weather data by selecting a date.
        </Text>

        <Text size="sm" mt="md" c="dimmed">
          By the way this is super duper in progress. Come back later for more.
        </Text>

        <DateEntryForm onSubmit={handleDateSubmit} />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return <Home />;
};

export default App;
