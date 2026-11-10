import { describe, it, expect, vi } from 'vitest';
import { memoize } from '../src/core/memoize.js';

describe('memoize', () => {
  it('caches results', () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);
    expect(memoized(3)).toBe(6);
    expect(memoized(3)).toBe(6);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('distinguishes different arguments', () => {
    const fn = vi.fn((x: number, y: number) => x + y);
    const memoized = memoize(fn);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(3, 4)).toBe(7);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
