// fixed temperature thresholds (in celsius) and their corresponding colors
// the interpolation function in getMarkerColor.ts creates smooth gradients between these points
// so we only need key transition points, not every degree
export const TEMP_THRESHOLDS = [
  { temp: -20, color: [75, 0, 130] as [number, number, number] }, // deep purple (-20 or below)
  { temp: -10, color: [0, 0, 255] as [number, number, number] }, // blue (-20 to -10)
  { temp: 0, color: [135, 206, 250] as [number, number, number] }, // light blue (-10 to 0)
  { temp: 8, color: [64, 224, 208] as [number, number, number] }, // greenish blue (0 to 8)
  { temp: 15, color: [154, 205, 50] as [number, number, number] }, // green with slight yellow (8 to 15)
  { temp: 23, color: [255, 255, 0] as [number, number, number] }, // yellow (15 to 23)
  { temp: 28, color: [255, 200, 0] as [number, number, number] }, // yellow orange (23 to 28)
  { temp: 33, color: [255, 140, 0] as [number, number, number] }, // orange (28 to 33)
  { temp: 39, color: [255, 69, 0] as [number, number, number] }, // orange-red (33 to 39)
  { temp: 45, color: [255, 0, 0] as [number, number, number] }, // red (39+)
];

// color range for heatmap layer (extracted from thresholds)
export const COLOR_RANGE: [number, number, number][] = TEMP_THRESHOLDS.map((t) => t.color);
