export interface Evaluation {
  readonly bulls: number;
  readonly cows: number;
}

export const evaluateGuess = (secret: string, guess: string): Evaluation => {
  const s = [...secret.toLowerCase()];
  const g = [...guess.toLowerCase()];
  if (s.length !== g.length) {
    throw new Error('Secret and guess length mismatch');
  }

  const bulls = g.reduce((count, ch, i) => (ch === s[i] ? count + 1 : count), 0);

  const secretSet = new Set(s);
  const cows = g.reduce((count, ch, i) => {
    if (ch === s[i]) return count;
    return secretSet.has(ch) ? count + 1 : count;
  }, 0);

  return { bulls, cows };
};
