const dataCache = new Map();

/**
 * Returns a stable value for a given key, either from the cache or the provided
 * value. If the provided value is an object, it is compared to the cached value
 * using JSON.stringify.
 * @param key - The key to use for the cache lookup.
 * @param value - The value to use if the key is not found in the cache.
 * @returns The cached value if it exists and is equal to the provided value,
 * otherwise the provided value (after caching it).
 */
export function getStableValue<T>(key: string, value: T): T {
  const prev = dataCache.get(key);

  if (typeof value === 'object') {
    const valueString = JSON.stringify(value);
    const prevString = JSON.stringify(prev);
    if (prevString === valueString) {
      return prev;
    }
  } else if (prev === value) {
    return prev;
  }

  dataCache.set(key, value);
  return value;
}
