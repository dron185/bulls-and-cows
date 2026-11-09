const DIGITS_BY_BASE: Readonly<Record<number, string>> = {
  2: '01',
  8: '01234567',
  10: '0123456789',
  16: '0123456789abcdef',
};

export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  const digits = DIGITS_BY_BASE[base];
  if (!digits) {
    throw new Error(`Unsupported base: ${base}`);
  }
  if (length < 1 || length > digits.length) {
    throw new Error(`Invalid length ${length} for base ${base}`);
  }

  const pickRecursive = (pool: readonly string[], acc: readonly string[]): readonly string[] => {
    if (acc.length === length) return acc;
    const idx = Math.floor(random() * pool.length);
    const chosen = pool[idx];
    const remaining = [...pool.slice(0, idx), ...pool.slice(idx + 1)];
    return pickRecursive(remaining, [...acc, chosen]);
  };

  return pickRecursive([...digits], []).join('');
};
