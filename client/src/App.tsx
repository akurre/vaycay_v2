import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import DateWeatherPage from "./pages/date";


function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/day/:date" element={<DateWeatherPage />} /> 
        </Routes>
      </BrowserRouter>
    );
  }

export default App;