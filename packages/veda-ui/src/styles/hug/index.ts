/* eslint-disable prettier/prettier */
import styled, {
  css,
  DefaultTheme,
  ThemedCssFunction
} from 'styled-components';
import { themeVal, media } from '@devseed-ui/theme-provider';

import { variableGlsp } from '../variable-utils';

// 🤗 Human Universal Gridder
//
// Grid:
//   start    1    2    3    4    5    6    7    8    9   10   11   12     end
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
// |      |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|  |*|      |
//
// The start and end take up 1 fraction and its size is fluid, depending on
// window size.
// Each column takes up a 12th of the max content width (defined in the theme).
// Grid gaps are marked with an asterisk.
// Each instance of Human Universal Gridder, nested inside another Human
// Universal Gridder must define its grid for the different media queries,
// through a grid prop.
// If the grid for a given media query is not defined the previous one will be
// used (<media query>Up pattern).
// The value for each media query breakpoint is an array with a start and an end
// column. It works much like the `grid-column` property of css.
//    <Hug>
//      <Hug
//        grid={{
//          smallUp: ['full-start', 'full-end'],
//          mediumUp: ['content-2', 'content-4'],
//          largeUp: ['content-2', 'content-5'],
//        }}
//      >
//        Subgrid 1
//      </Hug>
//      <Hug
//        grid={{
//          smallUp: ['full-start', 'full-end'],
//          // mediumUp is not defined, so smallUp will be used until largeUp.
//          largeUp: ['content-6', 'full-end'],
//        }}
//      >
//        Subgrid 2
//      </Hug>
//    </Hug>
//
// The Human Universal Gridder will define a grid whose line names are always
// the same regardless of how many nested grids there are. Therefore an element
// placed on `content-5` will be aligned with the top most `content-5`.

// Line names to be used on the grid.
// In a css grid, the lines are named, not the columns.
const gridLineNames = [
  'full-start',
  'content-start',
  // content-2 to content-12
  // content-1 does not exist as it is named content-start
  'content-2',
  'content-3',
  'content-4',
  'content-5',
  'content-6',
  'content-7',
  'content-8',
  'content-9',
  'content-10',
  'content-11',
  'content-12',
  'content-end',
  'full-end'
];

// List of media queries from the smallest to the largest.
const mdQueryOrdered = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

// Util from https://stackoverflow.com/a/49725198
// At least one key required in object.
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// Type from array
// https://steveholgado.com/typescript-types-from-arrays/
type MdQuery = typeof mdQueryOrdered[number];
type GridLines = typeof gridLineNames[number];

type GridderRange = [GridLines, GridLines];

// Remap the keys to <name>Up by creating an interface and then get the keys to have a union type.
type MdQueryUp = keyof { [K in MdQuery as `${K}Up`]: true };

type GridderDefinition = {
  [K in MdQueryUp]?: GridderRange;
};

export interface HugProps {
  // Remap the keys
  // https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as
  readonly grid?:
    | RequireAtLeastOne<GridderDefinition, MdQueryUp>
    | GridderRange;
}

/**
 * Check that the provided range is in the expected format which is an array
 * with the start and end grid lines.
 * For example: ['full-start', 'full-end']
 *
 * @throws Error if the value is not in correct format or names are invalid.
 *
 * @param {any} cols The grid range to validate
 */
const validateGridLineNames = (cols) => {
  let error = '';

  if (!Array.isArray(cols) || cols.length !== 2) {
    error = `The grid definition format is not valid. Please use an array defining the start and end range. Example:
  ['full-start', 'full-end']`;
  }

  if (cols.some((v) => !gridLineNames.includes(v))) {
    error = `The grid line names not valid. Please provide a valid name for the grid definition`;
  }

  // There was an error. Show the user info for debugging.
  if (error) {
    throw new Error(`🤗 Human Universal Gridder

    ${JSON.stringify(cols)}

${error}`);
  }
};

/**
 * Creates the universal grid for this component.
 *
 * @param {number} columns Number of columns for the grid.
 * @param {string} mdQuery Media query at which this grid is shown
 * @returns css
 */
function makeGrid(columns: number, mdQuery: MdQuery) {
  return ({ grid }: HugProps) => {
    const gridGap = variableGlsp();
    const layoutMax = themeVal('layout.max');

    // Discard the base padding to ensure that gridded folds have the same size as
    // the constrainers.
    const layoutMaxNoPadding = css`calc(${layoutMax} - ${gridGap})`;
    // Calculate how much of the content block (with is the layoutMaxNoPadding)
    // each column takes up.
    const fullColumn = css`calc(${layoutMaxNoPadding} / ${columns})`;
    // To get the usable size of each column we need to account for the gap.
    const contentColWidth = css`calc(${fullColumn} - ${gridGap})`;

    // Create the columns as:
    // [content-<num>] minmax(0, <size>)
    // Content columns start at index 2.
    const contentColumns = Array(columns - 1)
      .fill(0)
      .map((_, i) => ({
        name: `content-${i + 2}`,
        value: css`
          [content-${i + 2}] minmax(0, ${contentColWidth})
          `
      }));

    // Create an array with all the columns definitions. It will be used to
    // filter out the ones that are not needed when taking the user's grid
    // definition into account.
    const columnTemplate = [
      { name: 'full-start', value: css`[full-start] minmax(0, 1fr)` },
      {
        name: 'content-start',
        value: css`[content-start] minmax(0, ${contentColWidth})`
      },
      ...contentColumns,
      { name: 'content-end', value: css`[content-end] minmax(0, 1fr)` },
      { name: 'full-end', value: '[full-end]' }
    ];

    let gridTemplateColumns;
    let gridColumn;

    // If the user defined a grid property compute the subgrid.
    // This does two things:
    // - Set the start and end columns to what the user defined.
    // - Set the template-columns of this element to a subset of the parent (columnTemplate list)
    if (grid) {
      const [start, end] = getGridProp(grid, mdQuery);
      gridColumn = css`
        grid-column: ${start} / ${end};
      `;

      const startIdx = columnTemplate.findIndex((col) => col.name === start);
      const endIdx = columnTemplate.findIndex((col) => col.name === end);

      if (startIdx === -1 || endIdx === -1) {
        const line = startIdx === -1 ? start : end;
        throw new Error(`🤗 Human Universal Gridder

The grid line \`${line}\` does not exist in the ${mdQuery} media query which has ${columns} columns.
Grid lines for ${mdQuery}: ${columnTemplate.map(c => c.name).join(' | ')}`);
      }

      const lastColumn = columnTemplate[endIdx];
      gridTemplateColumns = [
        ...columnTemplate.slice(startIdx, endIdx),
        // Add the name of the last column without a size so we can use it for
        // naming purposes.
        { name: lastColumn.name, value: `[${lastColumn.name}]` }
      ];
    } else {
      // If we're not using a subset, just use all the columns.
      gridTemplateColumns = columnTemplate;
    }

    // The grid-template-columns will be a subset of this, depending on the grid
    // defined by the user.
    // grid-template-columns:
    //   [full-start] minmax(0, 1fr)
    //   [content-start] minmax(0, 000px)
    //   [content-2] minmax(0, 000px)
    //   [content-3] minmax(0, 000px)
    //   [content-4] minmax(0, 000px)
    //   ...
    //   [content-end] minmax(0, 1fr)
    //   [full-end];
    return css`
      ${gridColumn}
      grid-gap: ${gridGap};
      grid-template-columns: ${gridTemplateColumns.map((col) => col.value)};
    `;
  };
}

/**
 * Get the correct grid range for the given media query. If the grid for a given
 * media query is not defined the previous one will be used (<media query>Up
 * pattern).
 *
 * @param {number} columns Number of columns for the grid.
 * @param {string} mdQuery Media query at which this grid is shown
 *
 * @returns array
 */
const getGridProp = (grid, mdQuery) => {
  // If the user provided an array, assume it is the same on all media queries.
  if (Array.isArray(grid)) {
    validateGridLineNames(grid);
    return grid;
  }

  // From the current media query go back until we find one defined by the user
  // or reach the default. The replicates the behavior of <mediaQuery>Up
  const mdIndex = mdQueryOrdered.findIndex((v) => v === mdQuery);

  for (let i = mdIndex; i >= 0; i--) {
    const m = mdQueryOrdered[i];
    const key = `${m}Up`;
    // Did the user provide an override for this media query?
    if (grid[key]) {
      validateGridLineNames(grid[key]);
      return grid[key];
    }
    // No override. Check previous media range.
  }

  // content-start to content-end
  return [gridLineNames[1], gridLineNames[gridLineNames.length - 2]];
};

// Redeclare the media function to fix the types defined in the UI library.
const _media = media as unknown as {
  [K in keyof typeof media]: ThemedCssFunction<DefaultTheme>;
};

const Hug = styled.div<HugProps>`
  display: grid;
  ${makeGrid(4, mdQueryOrdered[0])}

  ${_media.smallUp`
    ${makeGrid(4, mdQueryOrdered[1])}
  `}

  ${_media.mediumUp`
    ${makeGrid(8, mdQueryOrdered[2])}
  `}

  ${_media.largeUp`
    ${makeGrid(12, mdQueryOrdered[3])}
  `}

  ${_media.xlargeUp`
    ${makeGrid(12, mdQueryOrdered[4])}
  `}
`;

export default Hug;
