import { describe, it, expect } from 'vitest';
import { dateToDayOfYear } from '../dateToDayOfYear';

describe('dateToDayOfYear', () => {
  it('converts january 1st to day 1', () => {
    expect(dateToDayOfYear('0101')).toBe(1);
  });

  it('converts december 31st to day 365', () => {
    expect(dateToDayOfYear('1231')).toBe(365);
  });

  it('converts february 1st to day 32', () => {
    expect(dateToDayOfYear('0201')).toBe(32);
  });

  it('converts march 1st to day 60 (non-leap year)', () => {
    expect(dateToDayOfYear('0301')).toBe(60);
  });

  it('converts june 15th correctly', () => {
    // jan(31) + feb(28) + mar(31) + apr(30) + may(31) + 15 = 166
    expect(dateToDayOfYear('0615')).toBe(166);
  });

  it('handles invalid input with empty string', () => {
    expect(dateToDayOfYear('')).toBe(1);
  });

  it('handles invalid input with wrong length', () => {
    expect(dateToDayOfYear('123')).toBe(1);
    expect(dateToDayOfYear('12345')).toBe(1);
  });

  it('handles null/undefined input', () => {
    expect(dateToDayOfYear(null as any)).toBe(1);
    expect(dateToDayOfYear(undefined as any)).toBe(1);
  });

  it('handles last day of each month correctly', () => {
    expect(dateToDayOfYear('0131')).toBe(31); // jan 31
    expect(dateToDayOfYear('0228')).toBe(59); // feb 28
    expect(dateToDayOfYear('0331')).toBe(90); // mar 31
    expect(dateToDayOfYear('0430')).toBe(120); // apr 30
    expect(dateToDayOfYear('0531')).toBe(151); // may 31
    expect(dateToDayOfYear('0630')).toBe(181); // jun 30
    expect(dateToDayOfYear('0731')).toBe(212); // jul 31
    expect(dateToDayOfYear('0831')).toBe(243); // aug 31
    expect(dateToDayOfYear('0930')).toBe(273); // sep 30
    expect(dateToDayOfYear('1031')).toBe(304); // oct 31
    expect(dateToDayOfYear('1130')).toBe(334); // nov 30
    expect(dateToDayOfYear('1231')).toBe(365); // dec 31
  });
});
