import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTodayAsMMDD } from '@/utils/dateFormatting/getTodayAsMMDD';

describe('getTodayAsMMDD', () => {
  beforeEach(() => {
    // reset date mock before each test
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restore real timers after each test
    vi.useRealTimers();
  });

  it('formats january date correctly', () => {
    vi.setSystemTime(new Date('2024-01-15'));
    expect(getTodayAsMMDD()).toBe('0115');
  });

  it('formats february date correctly', () => {
    vi.setSystemTime(new Date('2024-02-28'));
    expect(getTodayAsMMDD()).toBe('0228');
  });

  it('formats march date correctly', () => {
    vi.setSystemTime(new Date('2024-03-10'));
    expect(getTodayAsMMDD()).toBe('0310');
  });

  it('formats december date correctly', () => {
    vi.setSystemTime(new Date('2024-12-31'));
    expect(getTodayAsMMDD()).toBe('1231');
  });

  it('formats first day of month with leading zero', () => {
    vi.setSystemTime(new Date('2024-05-01'));
    expect(getTodayAsMMDD()).toBe('0501');
  });

  it('formats single digit day with leading zero', () => {
    vi.setSystemTime(new Date('2024-06-05'));
    expect(getTodayAsMMDD()).toBe('0605');
  });

  it('formats single digit month with leading zero', () => {
    vi.setSystemTime(new Date('2024-09-15'));
    expect(getTodayAsMMDD()).toBe('0915');
  });

  it('formats double digit month without extra padding', () => {
    vi.setSystemTime(new Date('2024-10-20'));
    expect(getTodayAsMMDD()).toBe('1020');
  });

  it('formats double digit day without extra padding', () => {
    vi.setSystemTime(new Date('2024-07-25'));
    expect(getTodayAsMMDD()).toBe('0725');
  });

  it('handles leap year february 29th', () => {
    vi.setSystemTime(new Date('2024-02-29'));
    expect(getTodayAsMMDD()).toBe('0229');
  });

  it('handles new years day', () => {
    vi.setSystemTime(new Date('2024-01-01'));
    expect(getTodayAsMMDD()).toBe('0101');
  });

  it('handles new years eve', () => {
    vi.setSystemTime(new Date('2024-12-31'));
    expect(getTodayAsMMDD()).toBe('1231');
  });

  it('returns consistent format across different years', () => {
    vi.setSystemTime(new Date('2023-06-15'));
    const result2023 = getTodayAsMMDD();

    vi.setSystemTime(new Date('2024-06-15'));
    const result2024 = getTodayAsMMDD();

    expect(result2023).toBe('0615');
    expect(result2024).toBe('0615');
    expect(result2023).toBe(result2024);
  });

  it('returns 4 character string', () => {
    vi.setSystemTime(new Date('2024-06-15'));
    const result = getTodayAsMMDD();

    expect(result).toHaveLength(4);
    expect(typeof result).toBe('string');
  });

  it('handles all months correctly', () => {
    const months = [
      { date: '2024-01-15', expected: '0115' },
      { date: '2024-02-15', expected: '0215' },
      { date: '2024-03-15', expected: '0315' },
      { date: '2024-04-15', expected: '0415' },
      { date: '2024-05-15', expected: '0515' },
      { date: '2024-06-15', expected: '0615' },
      { date: '2024-07-15', expected: '0715' },
      { date: '2024-08-15', expected: '0815' },
      { date: '2024-09-15', expected: '0915' },
      { date: '2024-10-15', expected: '1015' },
      { date: '2024-11-15', expected: '1115' },
      { date: '2024-12-15', expected: '1215' },
    ];

    months.forEach(({ date, expected }) => {
      vi.setSystemTime(new Date(date));
      expect(getTodayAsMMDD()).toBe(expected);
    });
  });
});
