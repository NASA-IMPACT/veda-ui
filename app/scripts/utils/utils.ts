import styled, { css, FlattenSimpleInterpolation } from 'styled-components';
import { visuallyDisabled } from '@devseed-ui/theme-provider';

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
export function mod(a: number, n: number) {
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
export function validateRangeNum(min: number, max: number) {
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

/**
 * Adds a visuallyDisabled prop to the component that when set to true visually
 * disables the component (through css) and prevents a click.
 *
 * @param Comp React Component to enhance
 * @param additionalStyles Additional styles to apply when visually disabled.
 * @returns Enhanced styled component.
 */
export function composeVisuallyDisabled(
  Comp,
  additionalStyles?: FlattenSimpleInterpolation
) {
  return styled(Comp).attrs((props) => {
    const onClickOriginal = props.onClick;
    return {
      onClick: (e) => {
        if (props.visuallyDisabled) {
          e.preventDefault();
          return;
        }
        return onClickOriginal?.(e);
      }
    };
  })`
    ${({ visuallyDisabled: vd }) =>
      vd &&
      css`
        ${visuallyDisabled()}

        &&&:hover {
          ${visuallyDisabled()}
          background: inherit;
        }

        ${additionalStyles}
      `}
  `;
}

/**
 * Checks if the given environment variable is set to 'true', ignoring case.
 * @param value - The value of the environment variable.
 * @returns A boolean indicating whether the flag is true.
 */
export function checkEnvFlag(value?: string): boolean {
  return (value ?? '').toLowerCase() === 'true';
}

/**
 * Checks if a given URL is an external link.
 *
 * An external link is defined as a URL that starts with "http://" or "https://".
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL is an external link, false otherwise.
 */
export const isExternalLink = (url: string): boolean => {
  return /^https?:\/\//.test(url);
};
