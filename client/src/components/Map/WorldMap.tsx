import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CityWeatherData } from '../../types/cityWeatherDataType';
import MapPopup from './MapPopup';
import markerIconPng from '/marker-icon.png';
import markerShadowPng from '/marker-shadow.png';

const markerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
});

function WorldMap({ cities }: { cities: CityWeatherData[] }) {
  return (
    <MapContainer center={[15, 0]} zoom={3} style={{ height: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {cities.map((city, index) => (
        <Marker
          key={index}
          position={[parseFloat(city.lat), parseFloat(city.long)]}
          icon={markerIcon}
        >
          <MapPopup city={city} />
        </Marker>
      ))}
    </MapContainer>
  );
}

export default WorldMap;
