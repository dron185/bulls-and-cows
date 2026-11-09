import { describe, it, expect } from 'vitest';
import { generateSecret } from '../src/core/generateSecret.js';

const fixedRandom = (value: number) => () => value;

describe('generateSecret', () => {
  it('generates a secret of requested length', () => {
    const secret = generateSecret(4, 10, fixedRandom(0));
    expect(secret).toHaveLength(4);
  });

  it('generates unique digits', () => {
    const secret = generateSecret(6, 10, fixedRandom(0.5));
    expect(new Set([...secret]).size).toBe(6);
  });

  it('uses only digits allowed by base', () => {
    const secret = generateSecret(2, 2, fixedRandom(0.1));
    expect([...secret].every((c) => '01'.includes(c))).toBe(true);
  });

  it('is deterministic with a fixed random source', () => {
    const seq = [0.1, 0.2, 0.3, 0.4];
    let i = 0;
    const rand = () => seq[i++ % seq.length];
    const a = generateSecret(4, 10, rand);
    i = 0;
    const b = generateSecret(4, 10, rand);
    expect(a).toBe(b);
  });

  it('produces different secrets for different randoms', () => {
    const a = generateSecret(4, 10, fixedRandom(0));
    const b = generateSecret(4, 10, fixedRandom(0.999));
    expect(a).not.toBe(b);
  });

  it('allows leading zero', () => {
    const secret = generateSecret(2, 10, fixedRandom(0));
    expect(secret[0]).toBe('0');
  });

  it('throws when length exceeds base alphabet', () => {
    expect(() => generateSecret(3, 2, fixedRandom(0))).toThrow();
  });

  it('throws for unsupported base', () => {
    expect(() => generateSecret(2, 5, fixedRandom(0))).toThrow();
  });
});
