import { describe, it, expect } from 'vitest';
import { countPossibleSecrets } from '../src/core/countPossibleSecrets.js';

describe('countPossibleSecrets', () => {
  it('returns 2 for length 2 in base 2', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it('returns P(base, length) for other cases', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(6, 10)).toBe(151200);
    expect(countPossibleSecrets(4, 16)).toBe(16 * 15 * 14 * 13);
  });

  it('returns 0 when length exceeds base', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
  });

  it('returns 1 for length 0', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('is stable across repeated calls (memoized)', () => {
    expect(countPossibleSecrets(6, 16)).toBe(countPossibleSecrets(6, 16));
  });
});
