import { describe, it, expect } from 'vitest';
import { generateDaysOptions } from '@/utils/dateFormatting/generateDaysOptions';

describe('generateDaysOptions', () => {
  it('generates 31 days for january', () => {
    const result = generateDaysOptions('01');
    expect(result).toHaveLength(31);
    expect(result[0]).toEqual({ value: '01', label: '01' });
    expect(result[30]).toEqual({ value: '31', label: '31' });
  });

  it('generates 28 days for february (non-leap year)', () => {
    const result = generateDaysOptions('02');
    expect(result).toHaveLength(28);
    expect(result[0]).toEqual({ value: '01', label: '01' });
    expect(result[27]).toEqual({ value: '28', label: '28' });
  });

  it('generates 31 days for march', () => {
    const result = generateDaysOptions('03');
    expect(result).toHaveLength(31);
  });

  it('generates 30 days for april', () => {
    const result = generateDaysOptions('04');
    expect(result).toHaveLength(30);
    expect(result[29]).toEqual({ value: '30', label: '30' });
  });

  it('generates 31 days for may', () => {
    const result = generateDaysOptions('05');
    expect(result).toHaveLength(31);
  });

  it('generates 30 days for june', () => {
    const result = generateDaysOptions('06');
    expect(result).toHaveLength(30);
  });

  it('generates 31 days for july', () => {
    const result = generateDaysOptions('07');
    expect(result).toHaveLength(31);
  });

  it('generates 31 days for august', () => {
    const result = generateDaysOptions('08');
    expect(result).toHaveLength(31);
  });

  it('generates 30 days for september', () => {
    const result = generateDaysOptions('09');
    expect(result).toHaveLength(30);
  });

  it('generates 31 days for october', () => {
    const result = generateDaysOptions('10');
    expect(result).toHaveLength(31);
  });

  it('generates 30 days for november', () => {
    const result = generateDaysOptions('11');
    expect(result).toHaveLength(30);
  });

  it('generates 31 days for december', () => {
    const result = generateDaysOptions('12');
    expect(result).toHaveLength(31);
  });

  it('formats single digit days with leading zero', () => {
    const result = generateDaysOptions('01');
    expect(result[0].value).toBe('01');
    expect(result[8].value).toBe('09');
  });

  it('formats double digit days without extra padding', () => {
    const result = generateDaysOptions('01');
    expect(result[9].value).toBe('10');
    expect(result[30].value).toBe('31');
  });

  it('returns array with correct structure', () => {
    const result = generateDaysOptions('01');
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('value');
    expect(result[0]).toHaveProperty('label');
  });

  it('has matching value and label for each option', () => {
    const result = generateDaysOptions('06');
    result.forEach((option) => {
      expect(option.value).toBe(option.label);
    });
  });

  it('generates sequential days starting from 01', () => {
    const result = generateDaysOptions('04');
    expect(result[0].value).toBe('01');
    expect(result[1].value).toBe('02');
    expect(result[2].value).toBe('03');
  });

  it('handles month with leading zero', () => {
    const result = generateDaysOptions('01');
    expect(result).toHaveLength(31);
  });

  it('handles month without leading zero', () => {
    const result = generateDaysOptions('1');
    expect(result).toHaveLength(31);
  });

  it('generates correct number of days for all months', () => {
    const monthDays = [
      { month: '01', days: 31 },
      { month: '02', days: 28 },
      { month: '03', days: 31 },
      { month: '04', days: 30 },
      { month: '05', days: 31 },
      { month: '06', days: 30 },
      { month: '07', days: 31 },
      { month: '08', days: 31 },
      { month: '09', days: 30 },
      { month: '10', days: 31 },
      { month: '11', days: 30 },
      { month: '12', days: 31 },
    ];

    monthDays.forEach(({ month, days }) => {
      const result = generateDaysOptions(month);
      expect(result).toHaveLength(days);
    });
  });
});
