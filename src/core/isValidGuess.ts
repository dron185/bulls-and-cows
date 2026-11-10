import { createDigitValidator } from './createDigitValidator.js';

export const isValidGuess = (guess: string, length: number, base: number): boolean => {
  if (typeof guess !== 'string') return false;
  const chars = [...guess.toLowerCase()];
  if (chars.length !== length) return false;
  const isDigit = createDigitValidator(base);
  if (!chars.every(isDigit)) return false;
  const unique = new Set(chars);
  return unique.size === chars.length;
};
