import { WeatherData } from '../../types/cityWeatherDataType';
import { Popup } from 'react-leaflet';

interface PopupProps {
  city: WeatherData;
}

const MapPopup = (Props: PopupProps) => {
  // TODO reformat all this crapola
  return (
    <Popup>
      <div className="space-y-1">
        <h3>
          {Props.city.city.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())},{' '}
          {Props.city.country ?? ''}
        </h3>
        {Props.city.maxTemperature !== null && (
          <p>Max Temp: {Props.city.maxTemperature.toFixed(1)}&deg;C</p>
        )}
        {Props.city.minTemperature !== null && (
          <p>Min Temp: {Props.city.minTemperature.toFixed(1)}&deg;C</p>
        )}
        {Props.city.avgTemperature !== null && (
          <p>Average Temp: {Props.city.avgTemperature.toFixed(1)}&deg;C</p>
        )}
        {Props.city.precipitation !== null && <p>Precipitation: {Props.city.precipitation}cm</p>}
        {Props.city.population !== null && (
          <p>Population: {Props.city.population.toLocaleString()}</p>
        )}
      </div>
    </Popup>
  );
};

export default MapPopup;
