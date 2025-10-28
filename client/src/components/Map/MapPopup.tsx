import { CityWeatherData } from '../../types/cityWeatherDataType';
import { Popup } from 'react-leaflet';

interface PopupProps {
  city: CityWeatherData;
}

const MapPopup = (Props: PopupProps) => {
  return (
    <Popup>
      <div className="space-y-1">
        <h3>
          {Props.city.city.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())},{' '}
          {Props.city.country}
        </h3>
        {Props.city.TMAX !== null && <p>Max Temp: {Props.city.TMAX.toFixed(1)}&deg;C</p>}
        {Props.city.TMIN !== null && <p>Min Temp: {Props.city.TMIN.toFixed(1)}&deg;C</p>}
        {Props.city.TAVG !== null && <p>Average Temp: {Props.city.TAVG.toFixed(1)}&deg;C</p>}
        {Props.city.PRCP !== null && <p>Precipitation: {Props.city.PRCP}cm</p>}
        {Props.city.population !== null && (
          <p>Population: {Props.city.population.toLocaleString()}</p>
        )}
      </div>
    </Popup>
  );
};

export default MapPopup;
