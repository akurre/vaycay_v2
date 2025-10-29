import { WeatherData } from '../../types/cityWeatherDataType';
import { Popup } from 'react-leaflet';
import { Title, Text } from '@mantine/core';
import { toTitleCase } from '../../utils/toTitleCase';
import { formatWeatherData } from './utils/formatWeatherData';

interface PopupProps {
  city: WeatherData;
}

const MapPopup = (Props: PopupProps) => {
  const weatherItems = formatWeatherData(Props.city);

  return (
    <Popup>
      <div className="space-y-1">
        <Title order={4}>
          {toTitleCase(Props.city.city)}, {Props.city.country ?? ''}
        </Title>
        {weatherItems.map((item, index) => (
          <Text key={index} size="sm">
            {item.label}: {item.value}
          </Text>
        ))}
      </div>
    </Popup>
  );
};

export default MapPopup;
