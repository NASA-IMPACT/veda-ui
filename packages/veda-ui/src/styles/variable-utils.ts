import { themeVal } from '@devseed-ui/theme-provider';
import { css as cssNoHighlight } from 'styled-components';

const variableType = (base, variable) => {
  return cssNoHighlight`calc(${base} + var(${variable}, 0rem))`;
};

/**
 * Returns the correct type size taking into account the provided value and the
 * increment (for the base text) for the current media query.
 *
 * @param {string} base The base size to use. This will be the size on top of
 * which the increment defined in the theme is added.
 *
 * @returns CSS expression
 *          like calc(base * var(--base-text-increment))
 */
export const variableBaseType = (base) =>
  variableType(base, '--base-text-increment');

/**
 * Returns the correct vertical space for prose contexts, taking into account
 * the font-size for each media breakpoint. The result is the space scaling
 * together with the font size.
 *
 * @returns CSS expression like calc(1rem + 0.5rem var(--base-text-increment))
 */
export const variableProseVSpace = () => {
  return cssNoHighlight`calc(
    ${variableBaseType(themeVal('type.base.size'))} + 0.5rem
  )`;
};

/**
 * Similar behavior to glsp but varies according to the current media query. The
 * layout.space is scaled taking into account the multipliers in
 * layout.glspMultiplier. Parameters can be provided to further scale the value.
 *
 * @see glsp()
 *
 * @param {...number} m multiplier
 */
export const variableGlsp = (...args) => {
  args = args.length ? args : [1];
  const fns = args.map(
    (m) =>
      cssNoHighlight`calc(${themeVal(
        'layout.space'
      )} * var(--base-space-multiplier, 1) * ${m})`
  );

  const spaces = Array(args.length - 1).fill(' ');
  return cssNoHighlight(['', ...spaces, ''] as any, ...fns);
};
