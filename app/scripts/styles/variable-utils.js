import { themeVal } from '@devseed-ui/theme-provider';
import { css } from 'styled-components';

const variableType = (base, variable) =>
  css`calc(${base} * var(${variable}, 1));`;

/**
 * Returns the correct type size taking into account the provided value and the
 * multiplier (for the base text) for the current media query.
 *
 * @param {string} base The bse size to use. This will be the size which is
 * multiplied by the multiplier defined in the theme.
 *
 * @returns CSS expression
 *          like calc(base * var(--base-text-multiplier))
 */
export const variableBaseType = (base) =>
  variableType(base, '--base-text-multiplier');

/**
 * Returns the correct vertical space for prose contexts, taking into account
 * the default prose spacing to use (glsp * 1.5) and the text multiplier. The
 * result is the space scaling together with the font size.
 *
 * @returns CSS expression like calc(glsp * 1.5 * var(--base-text-multiplier))
 */
export const variableProseVSpace = () =>
  css`calc(
    ${themeVal('layout.space')} * 1.5 * var(--base-text-multiplier, 1)
  )`;

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
  const c = css;
  const fns = args.map(
    (m) =>
      c`calc(${themeVal(
        'layout.space'
      )} * var(--base-space-multiplier, 1) * ${m})`
  );

  const spaces = Array(args.length - 1).fill(' ');
  return css(['', ...spaces, ''], ...fns);
};
