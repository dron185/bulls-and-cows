import { describe, it, expect } from 'vitest';
import { isValidGuess } from '../src/core/isValidGuess.js';

describe('isValidGuess', () => {
  it('accepts a valid decimal guess', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
  });

  it('accepts leading zero', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it('rejects wrong length', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
    expect(isValidGuess('12345', 4, 10)).toBe(false);
  });

  it('rejects duplicate digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
    expect(isValidGuess('1111', 4, 10)).toBe(false);
  });

  it('rejects digits not in base', () => {
    expect(isValidGuess('1234', 4, 2)).toBe(false);
    expect(isValidGuess('12ab', 4, 10)).toBe(false);
  });

  it('accepts hex case-insensitively', () => {
    expect(isValidGuess('ABCD', 4, 16)).toBe(true);
    expect(isValidGuess('abcd', 4, 16)).toBe(true);
    expect(isValidGuess('AbCd', 4, 16)).toBe(true);
  });

  it('rejects hex chars in decimal', () => {
    expect(isValidGuess('123a', 4, 10)).toBe(false);
    expect(isValidGuess('123A', 4, 10)).toBe(false);
  });
});
