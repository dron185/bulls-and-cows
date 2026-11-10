import { describe, it, expect } from 'vitest';
import { createDigitValidator } from '../src/core/createDigitValidator.js';

describe('createDigitValidator', () => {
  it('returns a predicate function', () => {
    const isDigit = createDigitValidator(10);
    expect(typeof isDigit).toBe('function');
  });

  it('accepts valid decimal digits', () => {
    const isDigit = createDigitValidator(10);
    expect(isDigit('0')).toBe(true);
    expect(isDigit('9')).toBe(true);
    expect(isDigit('a')).toBe(false);
  });

  it('accepts hex digits case-insensitively', () => {
    const isDigit = createDigitValidator(16);
    expect(isDigit('a')).toBe(true);
    expect(isDigit('A')).toBe(true);
    expect(isDigit('f')).toBe(true);
    expect(isDigit('F')).toBe(true);
    expect(isDigit('g')).toBe(false);
  });

  it('respects the base', () => {
    const bin = createDigitValidator(2);
    expect(bin('0')).toBe(true);
    expect(bin('1')).toBe(true);
    expect(bin('2')).toBe(false);
  });

  it('rejects empty or multi-character strings', () => {
    const isDigit = createDigitValidator(10);
    expect(isDigit('')).toBe(false);
    expect(isDigit('12')).toBe(false);
  });

  it('throws for unsupported base', () => {
    expect(() => createDigitValidator(7)).toThrow();
  });

  it('creates independent predicates per call (currying)', () => {
    const bin = createDigitValidator(2);
    const dec = createDigitValidator(10);
    expect(bin('2')).toBe(false);
    expect(dec('2')).toBe(true);
  });
});
