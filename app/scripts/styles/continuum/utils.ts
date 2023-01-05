import { css } from 'styled-components';
import { themeVal, media } from '@devseed-ui/theme-provider';

import { variableGlsp } from '$styles/variable-utils';

/**
 * Calculates the sizes of different grid components taking into account
 * viewport size and media query.
 *
 * Properties calculated:
 * layoutStart    Distance from full-start to first grid line
 * column         Full width of a column (usable + gap)
 * columnUsable   Usable width of a column.
 * columnGap      Grid gap at the given media query
 * layoutEnd      Distance from last grid line to full-end
 *
 * All the properties are returned as functions that resolve when used in a
 * styled component. The can be executed expecting a value output.
 *
 * @param {string} mediaQuery Media query to use for calculation
 * @param {number} viewportWidth Width of the viewport at the current moment.
 */
const getGridSizesForMediaQuery = (
  mediaQuery: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge',
  viewportWidth: number
) => {
  // This is hardcoded here and has to match the HUG Definition
  const colsPerMedia = {
    xsmall: 4,
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 12
  };

  const vwPx = `${viewportWidth}px`;

  // Number of the columns the grid has in this media query.
  const mdColumns = colsPerMedia[mediaQuery];
  // Grid gap for the current media.
  const gapVal = variableGlsp();

  // Max layout size.
  const layoutMax = themeVal('layout.max');
  // Size of the layout taking the viewport width into account.
  const layoutSize = css`min(${vwPx}, ${layoutMax})`;
  // Layout size without the padding on one of the sides. Only one is removed to
  // make the calculation of the column size easier, otherwise we'd need to
  // take into account n columns and n-1 gaps
  const layoutSizeNoPadding = css`calc(${layoutSize} - ${gapVal})`;
  // Each column takes up a 12th of the content block (which is the
  // layoutMaxNoPadding).
  const fullColumn = css`calc(${layoutSizeNoPadding} / ${mdColumns})`;
  // To get the usable size of each column we need to account for the gap.
  const contentColWidth = css`calc(${fullColumn} - ${gapVal})`;

  // Space from full-start to the first line
  const layoutStart = css`max((${vwPx} - ${layoutMax}) / 2, 0px)`;

  // Space from the last line to full-end
  const layoutEnd = css`min(${vwPx} - ${layoutStart}, ${vwPx})`;

  return {
    layoutStart,
    column: fullColumn,
    columnUsable: contentColWidth,
    columnGap: gapVal,
    layoutEnd
  };
};

/**
 * Applies the needed margin so that the element starts at the named column.
 * This only works if the container spans the full width of the viewport.
 *
 * @param {number} viewportWidth Width of the viewport at the current moment.
 * @param {number} startCol HUG column where to start the content.
 */
export const calcMargin = ({
  viewportWidth,
  startCol
}: {
  viewportWidth: number;
  startCol: string;
}) => {
  // Handle the "content-<no>" options.
  const [, colNo] = startCol.match(/^content-([0-9]{1,2})$/) ?? [];

  const marginForMd = (md, offsetCols = 0) => {
    const gridVals = getGridSizesForMediaQuery(md, viewportWidth);
    const { layoutStart, columnGap, column } = gridVals;

    const columnsWidth = css`calc(${column} * ${offsetCols})`;

    return css`
      margin-left: calc(${layoutStart} + ${columnGap} + ${columnsWidth});
    `;
  };

  if (startCol === 'full-start') {
    return css`
      margin-left: 0;
    `;
  } else if (startCol === 'content-start' || colNo) {
    const cols = colNo ? parseInt(colNo) - 1 : 0;

    return css`
      ${marginForMd('xsmall', cols)}

      ${media.smallUp`
        ${marginForMd('small', cols)}
      `}

      ${media.mediumUp`
        ${marginForMd('medium', cols)}
      `}

      ${media.largeUp`
        ${marginForMd('large', cols)}
      `}

      ${media.xlargeUp`
        ${marginForMd('xlarge', cols)}
      `}
    `;
  } else if (startCol === 'content-end') {
    // There's no need for a media query for the layoutEnd value.
    const { layoutEnd } = getGridSizesForMediaQuery('xsmall', viewportWidth);
    return css`
      margin-left: ${layoutEnd};
    `;
  } else if (startCol === 'full-end') {
    return css`
      margin-left: ${viewportWidth};
    `;
  }
};

/**
 * Calculated the width necessary for an element to span the given amount of
 * columns in the HUG.
 * This only works if the container spans the full width of the viewport.
 *
 * @param {number} viewportWidth Width of the viewport at the current moment.
 * @param {number} spanCols HUG column for the content to span.
 */
export const calcItemWidth = ({
  viewportWidth,
  spanCols
}: {
  viewportWidth: number;
  spanCols: number;
}) => {
  const widthForItem = (md) => {
    const gridVals = getGridSizesForMediaQuery(md, viewportWidth);
    const { columnGap, columnUsable } = gridVals;

    const width = css`
      calc(${columnUsable} * ${spanCols} + ${columnGap} * ${spanCols - 1})
    `;

    return css`
      width: ${width};
    `;
  };

  return css`
    ${widthForItem('xsmall')}

    ${media.smallUp`
      ${widthForItem('small')}
    `}

    ${media.mediumUp`
      ${widthForItem('medium')}
    `}

    ${media.largeUp`
      ${widthForItem('large')}
    `}

    ${media.xlargeUp`
      ${widthForItem('xlarge')}
    `}
  `;
};
