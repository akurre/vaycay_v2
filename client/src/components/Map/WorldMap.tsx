import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherData } from '../../types/cityWeatherDataType';
import MapPopup from './MapPopup';
import markerIcon from './utils/markerIcon';
import { hasCoords } from './utils/hasCoords';

function WorldMap({ cities }: { cities: WeatherData[] }) {
    return (
        <MapContainer center={[15, 0]} zoom={3} style={{ height: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {cities.filter(hasCoords).map((city, index) => (
                <Marker
                    key={index} // TODO dont include index in key
                    position={[city.lat, city.long]}
                    icon={markerIcon}
                >
                    <MapPopup city={city}  />
                </Marker>
            ))}
        </MapContainer>
    );
}


export default WorldMap;
