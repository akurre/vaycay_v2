import { Modal, Text, Title } from '@mantine/core';
import { WeatherData } from '../../types/cityWeatherDataType';
import { formatTemperature } from '../../utils/formatTemperature';
import { toTitleCase } from '../../utils/toTitleCase';

interface CityPopupProps {
  city: WeatherData | null;
  onClose: () => void;
}

interface FieldProps {
  label: string;
  value: string | number;
  monospace?: boolean;
}

const Field = ({ label, value, monospace }: FieldProps) => (
  <div>
    <Text size="sm" c="dimmed">
      {label}
    </Text>
    <Text size="md" ff={monospace ? 'monospace' : undefined}>
      {value}
    </Text>
  </div>
);

function CityPopup({ city, onClose }: CityPopupProps) {
  if (!city) return null;

  const formatValue = (value: number | null, unit: string) =>
    value !== null ? `${value.toFixed(1)}${unit}` : 'N/A';

  return (
    <Modal
      opened={!!city}
      onClose={onClose}
      title={
        <Title order={3}>
          {toTitleCase(city.city)}
          {city.country && `, ${city.country}`}
        </Title>
      }
      size="md"
    >
      <div className="flex flex-col gap-3">
        {city.state && <Field label="State/Region" value={toTitleCase(city.state)} />}
        {city.suburb && <Field label="Suburb" value={toTitleCase(city.suburb)} />}
        <Field label="Date" value={city.date} />

        <div className="mt-2 border-t border-gray-200 pt-3">
          <Text size="sm" fw={600} mb="xs">
            Temperature
          </Text>
          <div className="grid grid-cols-3 gap-2">
            <Field
              label="Average"
              value={formatTemperature(city.avgTemperature) ?? 'N/A'}
            />
            <Field
              label="Max"
              value={formatTemperature(city.maxTemperature) ?? 'N/A'}
            />
            <Field
              label="Min"
              value={formatTemperature(city.minTemperature) ?? 'N/A'}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <Text size="sm" fw={600} mb="xs">
            Precipitation
          </Text>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Rainfall" value={formatValue(city.precipitation, ' mm')} />
            <Field label="Snow Depth" value={formatValue(city.snowDepth, ' cm')} />
          </div>
        </div>

        {city.population && (
          <div className="border-t border-gray-200 pt-3">
            <Field label="Population" value={city.population.toLocaleString()} />
          </div>
        )}

        <div className="border-t border-gray-200 pt-3">
          <Field label="Weather Station" value={city.stationName} />
        </div>

        {city.lat !== null && city.long !== null && (
          <div className="border-t border-gray-200 pt-3">
            <Field
              label="Coordinates"
              value={`${city.lat.toFixed(4)}°, ${city.long.toFixed(4)}°`}
              monospace
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

export default CityPopup;
