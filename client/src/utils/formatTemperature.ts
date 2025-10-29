export function formatTemperature(temp: number | null): string | null {
  if (temp === null) return null;
  return `${temp.toFixed(1)}°C`;
}
