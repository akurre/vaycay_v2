import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from './theme';
import Home from './pages/home';
import DateWeatherPage from './pages/date';

function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/day/:date" element={<DateWeatherPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
