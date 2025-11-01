import { describe, it, expect } from 'vitest';
import { formatValue } from '@/utils/dataFormatting/formatValue';

describe('formatValue', () => {
  it('formats value with unit correctly', () => {
    expect(formatValue(25.5, '°C')).toBe('25.5°C');
  });

  it('formats value with different units', () => {
    expect(formatValue(100, 'mm')).toBe('100.0mm');
    expect(formatValue(50.3, '%')).toBe('50.3%');
    expect(formatValue(1013.25, 'hPa')).toBe('1013.3hPa');
  });

  it('rounds to one decimal place', () => {
    expect(formatValue(25.567, '°C')).toBe('25.6°C');
    expect(formatValue(25.123, '°C')).toBe('25.1°C');
  });

  it('returns N/A for null value', () => {
    expect(formatValue(null, '°C')).toBe('N/A');
    expect(formatValue(null, 'mm')).toBe('N/A');
  });

  it('handles zero value', () => {
    expect(formatValue(0, '°C')).toBe('0.0°C');
  });

  it('handles negative values', () => {
    expect(formatValue(-10.5, '°C')).toBe('-10.5°C');
  });

  it('handles empty unit string', () => {
    expect(formatValue(25.5, '')).toBe('25.5');
  });
});
