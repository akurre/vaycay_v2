import { describe, it, expect } from 'vitest';
import { formatTemperature } from '@/utils/tempFormatting/formatTemperature';

describe('formatTemperature', () => {
  it('formats positive temperature correctly', () => {
    expect(formatTemperature(25.5)).toBe('25.5°C');
  });

  it('formats negative temperature correctly', () => {
    expect(formatTemperature(-10.3)).toBe('-10.3°C');
  });

  it('formats zero temperature correctly', () => {
    expect(formatTemperature(0)).toBe('0.0°C');
  });

  it('rounds to one decimal place', () => {
    expect(formatTemperature(25.567)).toBe('25.6°C');
    expect(formatTemperature(25.123)).toBe('25.1°C');
  });

  it('returns null for null input', () => {
    expect(formatTemperature(null)).toBeNull();
  });

  it('handles very large temperatures', () => {
    expect(formatTemperature(100.5)).toBe('100.5°C');
  });

  it('handles very small temperatures', () => {
    expect(formatTemperature(-50.2)).toBe('-50.2°C');
  });
});
