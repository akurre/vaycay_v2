import { describe, it, expect } from 'vitest';
import { toTitleCase } from '@/utils/dataFormatting/toTitleCase';

describe('toTitleCase', () => {
  it('converts single word to title case', () => {
    expect(toTitleCase('hello')).toBe('Hello');
    expect(toTitleCase('WORLD')).toBe('World');
  });

  it('converts multiple words to title case', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
    expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
  });

  it('handles mixed case input', () => {
    expect(toTitleCase('hELLo WoRLD')).toBe('Hello World');
  });

  it('handles strings with numbers', () => {
    expect(toTitleCase('test 123 case')).toBe('Test 123 Case');
  });

  it('handles strings with special characters', () => {
    expect(toTitleCase('hello-world')).toBe('Hello-World');
    expect(toTitleCase('hello_world')).toBe('Hello_World');
  });

  it('handles empty string', () => {
    expect(toTitleCase('')).toBe('');
  });

  it('handles single character', () => {
    expect(toTitleCase('a')).toBe('A');
  });

  it('preserves multiple spaces', () => {
    expect(toTitleCase('hello  world')).toBe('Hello  World');
  });

  it('handles strings with punctuation', () => {
    expect(toTitleCase('hello, world!')).toBe('Hello, World!');
  });
});
