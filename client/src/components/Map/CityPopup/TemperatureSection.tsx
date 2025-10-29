import { Text } from '@mantine/core';
import { formatTemperature } from '../../../utils/formatTemperature';
import Field from './Field';

interface TemperatureSectionProps {
  avgTemperature: number | null;
  maxTemperature: number | null;
  minTemperature: number | null;
}

const TemperatureSection = ({
  avgTemperature,
  maxTemperature,
  minTemperature,
}: TemperatureSectionProps) => {
  return (
    <div className="mt-2 border-t border-gray-200 pt-3">
      <Text size="sm" fw={600} mb="xs">
        Temperature
      </Text>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Average" value={formatTemperature(avgTemperature) ?? 'N/A'} />
        <Field label="Max" value={formatTemperature(maxTemperature) ?? 'N/A'} />
        <Field label="Min" value={formatTemperature(minTemperature) ?? 'N/A'} />
      </div>
    </div>
  );
};

export default TemperatureSection;
