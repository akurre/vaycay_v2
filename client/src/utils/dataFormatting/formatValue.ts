export const formatValue = (value: number | null, unit: string): string => {
  return value !== null ? `${value.toFixed(1)}${unit}` : 'N/A';
};
