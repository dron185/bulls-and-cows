const DIGITS_BY_BASE: Readonly<Record<number, string>> = {
  2: '01',
  8: '01234567',
  10: '0123456789',
  16: '0123456789abcdef',
};

export const createDigitValidator = (base: number): ((char: string) => boolean) => {
  const digits = DIGITS_BY_BASE[base];
  if (!digits) {
    throw new Error(`Unsupported base: ${base}`);
  }
  return (char: string): boolean => {
    if (typeof char !== 'string' || char.length !== 1) return false;
    return digits.includes(char.toLowerCase());
  };
};
