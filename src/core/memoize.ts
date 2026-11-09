export const memoize = <A extends readonly unknown[], R>(
  fn: (...args: A) => R,
  keyFn: (...args: A) => string = (...args: A) => args.map(String).join('|'),
): ((...args: A) => R) => {
  const cache = new Map<string, R>();
  return (...args: A): R => {
    const key = keyFn(...args);
    const cached = cache.get(key);
    if (cached !== undefined) return cached;
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };
};
