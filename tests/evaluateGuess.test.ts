import { describe, it, expect } from 'vitest';
import { evaluateGuess } from '../src/core/evaluateGuess.js';

describe('evaluateGuess', () => {
  it('detects all bulls', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('detects all cows', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('detects mixed results', () => {
    expect(evaluateGuess('1234', '1243')).toEqual({ bulls: 2, cows: 2 });
    expect(evaluateGuess('1234', '2314')).toEqual({ bulls: 1, cows: 3 });
  });

  it('detects no matches', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('is case-insensitive for hex', () => {
    expect(evaluateGuess('abcdef', 'ABCDEF')).toEqual({ bulls: 6, cows: 0 });
    expect(evaluateGuess('abcd', 'DCBA')).toEqual({ bulls: 0, cows: 4 });
  });

  it('throws on length mismatch', () => {
    expect(() => evaluateGuess('1234', '123')).toThrow();
  });
});
