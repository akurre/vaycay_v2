// fixed temperature thresholds (in celsius) and their corresponding colors
export const TEMP_THRESHOLDS = [
  { temp: -20, color: [75, 0, 130] as [number, number, number] }, // deep purple (very cold)
  { temp: -10, color: [0, 0, 200] as [number, number, number] }, // deep blue (cold)
  { temp: 0, color: [0, 100, 255] as [number, number, number] }, // blue (freezing)
  { temp: 10, color: [0, 200, 255] as [number, number, number] }, // light blue (cool)
  { temp: 20, color: [0, 255, 100] as [number, number, number] }, // cyan-green (mild)
  { temp: 25, color: [200, 255, 0] as [number, number, number] }, // yellow-green (warm)
  { temp: 30, color: [255, 200, 0] as [number, number, number] }, // orange-yellow (hot)
  { temp: 35, color: [255, 100, 0] as [number, number, number] }, // orange-red (very hot)
  { temp: 40, color: [255, 0, 0] as [number, number, number] }, // bright red (extreme)
];

// color range for heatmap layer (extracted from thresholds)
export const COLOR_RANGE: [number, number, number][] = TEMP_THRESHOLDS.map((t) => t.color);
