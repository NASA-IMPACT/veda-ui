/**
 * Calculates the integer remainder of a division of a by n, handling negative
 * modulo in the mathematically expected way.
 *
 * This is very helpful for cycling array indexes.
 * If the current index is the first, the last is returned, and vice-versa.
 *
 * Given an index if we want to know the previous:
 * @example
 *   const arr = [1, 2, 3];
 *   const arrIdx = 0;
 *   const newIdx = mod(arrIdx - 1, arr.length); // 2
 *
 * @param {number} a Dividend
 * @param {number} n Divisor
 */
export function mod(a, n) {
  return ((a % n) + n) % n;
}

/**
 * Created a validator function that ensures a number is within the given range.
 *
 * @param {number} min Range lower bound (inclusive)
 * @param {number} max Range upper bound (inclusive)
 *
 * @returns {function} Validator function.
 */
export function validateRangeNum(min, max) {
  return (raw) => {
    const value = Number(raw);
    return !isNaN(value) && raw !== '' && value >= min && value <= max;
  };
}

/**
 * Compares two values using JSON stringification.
 *
 * @param {mixed} a Data to compare
 * @param {mixed} b Data to compare
 */
export function isEqualObj(a, b) {
  // Exist early if they're the same.
  if (a === b) return true;
  return JSON.stringify(a) === JSON.stringify(b);
}
