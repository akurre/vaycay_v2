import { describe, it, expect } from 'vitest';
import { getMarkerColor } from '@/utils/map/getMarkerColor';

describe('getMarkerColor', () => {
  it('returns deep purple for extreme cold (-20°C or below)', () => {
    expect(getMarkerColor(-20)).toEqual([75, 0, 130]);
    expect(getMarkerColor(-25)).toEqual([75, 0, 130]);
  });

  it('returns red for extreme heat (45°C or above)', () => {
    expect(getMarkerColor(45)).toEqual([255, 0, 0]);
    expect(getMarkerColor(50)).toEqual([255, 0, 0]);
  });

  it('returns exact threshold colors at threshold temperatures', () => {
    expect(getMarkerColor(-10)).toEqual([0, 0, 255]); // blue
    expect(getMarkerColor(0)).toEqual([135, 206, 250]); // light blue
    expect(getMarkerColor(13)).toEqual([34, 139, 34]); // green with a little yellow
    expect(getMarkerColor(19)).toEqual([255, 255, 0]); // mostly yellow
  });

  it('interpolates colors between thresholds', () => {
    // test midpoint between 0°C (135, 206, 250) and 8°C (64, 224, 208)
    const midColor = getMarkerColor(4);
    // at midpoint, red channel should be between 64 and 135
    expect(midColor[0]).toBeGreaterThanOrEqual(64);
    expect(midColor[0]).toBeLessThanOrEqual(135);
    expect(midColor).toHaveLength(3);
  });

  it('returns valid RGB values (0-255)', () => {
    const testTemps = [-30, -5, 10, 20, 30, 40, 50];
    testTemps.forEach((temp) => {
      const color = getMarkerColor(temp);
      expect(color).toHaveLength(3);
      color.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(255);
      });
    });
  });

  it('handles typical temperature ranges smoothly', () => {
    // test a range of common temperatures
    const color10 = getMarkerColor(10);
    const color20 = getMarkerColor(20);
    const color30 = getMarkerColor(30);

    // colors should be different
    expect(color10).not.toEqual(color20);
    expect(color20).not.toEqual(color30);
  });

  it('returns integer RGB values', () => {
    const color = getMarkerColor(12.5);
    color.forEach((value) => {
      expect(Number.isInteger(value)).toBe(true);
    });
  });
});
