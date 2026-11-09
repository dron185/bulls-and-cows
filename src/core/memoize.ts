export function memoize<A extends readonly unknown[], R>(
  fn: (...args: A) => R,
  _keyFn?: (...args: A) => string,
): (...args: A) => R {
  return (...args: A): R => fn(...args);
}
