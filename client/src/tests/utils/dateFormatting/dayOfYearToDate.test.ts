import { describe, it, expect } from 'vitest';
import { dayOfYearToDate } from '@/utils/dateFormatting/dayOfYearToDate';

describe('dayOfYearToDate', () => {
  it('converts first day of year correctly', () => {
    expect(dayOfYearToDate(1)).toBe('0101');
  });

  it('converts last day of january correctly', () => {
    expect(dayOfYearToDate(31)).toBe('0131');
  });

  it('converts first day of february correctly', () => {
    expect(dayOfYearToDate(32)).toBe('0201');
  });

  it('converts last day of february correctly (non-leap year)', () => {
    expect(dayOfYearToDate(59)).toBe('0228');
  });

  it('converts first day of march correctly', () => {
    expect(dayOfYearToDate(60)).toBe('0301');
  });

  it('converts mid-year date correctly', () => {
    // day 182 = july 1st
    expect(dayOfYearToDate(182)).toBe('0701');
  });

  it('converts last day of year correctly', () => {
    expect(dayOfYearToDate(365)).toBe('1231');
  });

  it('converts day in april correctly', () => {
    // day 100 = april 10th
    expect(dayOfYearToDate(100)).toBe('0410');
  });

  it('converts day in august correctly', () => {
    // day 244 = september 1st
    expect(dayOfYearToDate(244)).toBe('0901');
  });

  it('converts day in december correctly', () => {
    // day 350 = december 16th
    expect(dayOfYearToDate(350)).toBe('1216');
  });

  it('handles month transitions correctly', () => {
    // january 31st
    expect(dayOfYearToDate(31)).toBe('0131');
    // february 1st
    expect(dayOfYearToDate(32)).toBe('0201');
  });

  it('formats single digit months with leading zero', () => {
    expect(dayOfYearToDate(1)).toBe('0101');
    expect(dayOfYearToDate(32)).toBe('0201');
  });

  it('formats single digit days with leading zero', () => {
    expect(dayOfYearToDate(1)).toBe('0101');
    expect(dayOfYearToDate(32)).toBe('0201');
  });
});
