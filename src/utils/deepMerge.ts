const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Merges `source` into `target` without mutating either. Arrays are
 * concatenated, plain objects merge key by key, anything else takes `source`.
 * Keys keep the order of `target`, and new keys from `source` come last.
 *
 * `Object.fromEntries` defines own properties, so a `__proto__` key in the
 * input stays a plain key and never changes the prototype of the result.
 *
 * @param target - The value to merge into.
 * @param source - The value whose entries win on conflict.
 * @returns A new merged value.
 * @example deepMerge({ tags: ['a'] }, { tags: ['b'] }) // { tags: ['a', 'b'] }
 */
export const deepMerge = (target: unknown, source: unknown): unknown => {
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source];
  }

  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source;
  }

  return Object.fromEntries([
    ...Object.entries(target).map(([key, value]) => [
      key,
      Object.hasOwn(source, key) ? deepMerge(value, source[key]) : value,
    ]),
    ...Object.entries(source).filter(([key]) => !Object.hasOwn(target, key)),
  ]);
};
