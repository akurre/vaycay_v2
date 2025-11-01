import { describe, it, expect } from 'vitest';
import { getDayLabel } from '@/utils/navigation/getDayLabel';

describe('getDayLabel', () => {
  it('returns the day value when provided', () => {
    expect(getDayLabel('15')).toBe('15');
  });

  it('returns single digit day value', () => {
    expect(getDayLabel('5')).toBe('5');
  });

  it('returns double digit day value', () => {
    expect(getDayLabel('25')).toBe('25');
  });

  it('returns "Day" for null value', () => {
    expect(getDayLabel(null)).toBe('Day');
  });

  it('returns "Day" for empty string', () => {
    expect(getDayLabel('')).toBe('Day');
  });

  it('returns day value with leading zero', () => {
    expect(getDayLabel('01')).toBe('01');
  });

  it('returns day value for first day of month', () => {
    expect(getDayLabel('01')).toBe('01');
  });

  it('returns day value for last day of month', () => {
    expect(getDayLabel('31')).toBe('31');
  });

  it('returns any string value provided', () => {
    expect(getDayLabel('abc')).toBe('abc');
  });
});
