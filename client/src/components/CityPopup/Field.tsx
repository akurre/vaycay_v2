import { Text } from '@mantine/core';

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

export default Field;
