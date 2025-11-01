import { describe, it, expect } from 'vitest';
import { getMonthLabel } from '@/utils/navigation/getMonthLabel';

describe('getMonthLabel', () => {
  it('returns correct label for january', () => {
    expect(getMonthLabel('01')).toBe('January');
  });

  it('returns correct label for february', () => {
    expect(getMonthLabel('02')).toBe('February');
  });

  it('returns correct label for march', () => {
    expect(getMonthLabel('03')).toBe('March');
  });

  it('returns correct label for april', () => {
    expect(getMonthLabel('04')).toBe('April');
  });

  it('returns correct label for may', () => {
    expect(getMonthLabel('05')).toBe('May');
  });

  it('returns correct label for june', () => {
    expect(getMonthLabel('06')).toBe('June');
  });

  it('returns correct label for july', () => {
    expect(getMonthLabel('07')).toBe('July');
  });

  it('returns correct label for august', () => {
    expect(getMonthLabel('08')).toBe('August');
  });

  it('returns correct label for september', () => {
    expect(getMonthLabel('09')).toBe('September');
  });

  it('returns correct label for october', () => {
    expect(getMonthLabel('10')).toBe('October');
  });

  it('returns correct label for november', () => {
    expect(getMonthLabel('11')).toBe('November');
  });

  it('returns correct label for december', () => {
    expect(getMonthLabel('12')).toBe('December');
  });

  it('returns "Month" for null value', () => {
    expect(getMonthLabel(null)).toBe('Month');
  });

  it('returns "Month" for invalid month value', () => {
    expect(getMonthLabel('13')).toBe('Month');
  });

  it('returns "Month" for empty string', () => {
    expect(getMonthLabel('')).toBe('Month');
  });

  it('returns "Month" for non-numeric string', () => {
    expect(getMonthLabel('invalid')).toBe('Month');
  });

  it('returns "Month" for zero', () => {
    expect(getMonthLabel('00')).toBe('Month');
  });
});
