import { WeatherData } from '../../types/cityWeatherDataType';
import { Popup } from 'react-leaflet';
import { Title, Text } from '@mantine/core';
import { toTitleCase } from '../../utils/toTitleCase';
import { formatWeatherData } from './utils/formatWeatherData';

interface PopupProps {
  city: WeatherData;
}

const MapPopup = ({ city }: PopupProps) => {
  const weatherItems = formatWeatherData(city);

  return (
    <Popup>
      <div className="space-y-1">
        <Title order={4}>
          {toTitleCase(city.city)}, {city.country ?? ''}
        </Title>
        {weatherItems.map((item) => (
          <Text key={item.label} size="sm">
            {item.label}: {item.value}
          </Text>
        ))}
      </div>
    </Popup>
  );
};

export default MapPopup;
