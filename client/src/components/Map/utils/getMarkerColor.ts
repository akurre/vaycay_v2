// Temperature color gradient: blue (cold) -> cyan -> green -> yellow -> orange -> red (hot)
const COLOR_RANGE: [number, number, number][] = [
  [0, 0, 255],      // Blue: coldest
  [0, 128, 255],    // Light blue
  [0, 255, 255],    // Cyan
  [0, 255, 128],    // Cyan-green
  [128, 255, 0],    // Yellow-green
  [255, 255, 0],    // Yellow
  [255, 128, 0],    // Orange
  [255, 0, 0],      // Red: hottest
];

export const getMarkerColor = (
  temp: number,
  minTemp: number,
  maxTemp: number
): [number, number, number] => {
  if (maxTemp === minTemp) return [128, 128, 128];
  const normalized = (temp - minTemp) / (maxTemp - minTemp);
  const colorIndex = Math.floor(normalized * (COLOR_RANGE.length - 1));
  return COLOR_RANGE[Math.min(colorIndex, COLOR_RANGE.length - 1)];
};

export { COLOR_RANGE };
