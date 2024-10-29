import endOfDay from 'date-fns/endOfDay';
import endOfMonth from 'date-fns/endOfMonth';
import endOfYear from 'date-fns/endOfYear';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import startOfYear from 'date-fns/startOfYear';
import { TimeDensity } from '$components/exploration/types.d.ts';

/**
 * Calculate the start and end of a block of time, given a date and a time
 * density
 * @param date Starting date
 * @param timeDensity Dataset time density
 *
 * @returns Array of two dates, the first being the start of the block and the
 * second being the end of the block.
 */
export function getBlockBoundaries(date: Date, timeDensity: TimeDensity) {
  switch (timeDensity) {
    case TimeDensity.MONTH:
      return [startOfMonth(date), endOfMonth(date)];
    case TimeDensity.YEAR:
      return [startOfYear(date), endOfYear(date)];
  }

  return [startOfDay(date), endOfDay(date)];
}

/**
 * Lumps blocks of time together if they are too small to be seen on the chart.
 *
 * @param params.domain The dataset domain from which to calculate the blocks
 * @param params.xScaled The xScaled function from the chart
 * @param params.timeDensity The dataset time density
 * @param params.minBlockSize The minimum size of a block
 *
 * @returns The blocks and whether or not any lumping happened.
 */
export function lumpBlocks({ domain, xScaled, timeDensity, minBlockSize = 4 }) {
  // How big would a block be?
  const [start, end] = getBlockBoundaries(domain[0], timeDensity);

  const blockWidth = xScaled(end) - xScaled(start);

  if (blockWidth >= minBlockSize) {
    return {
      blocks: domain.map((d) => getBlockBoundaries(d, timeDensity)),
      wasLumped: false
    };
  }

  let blocks: Date[][] = [];
  let startBoundary = start;
  let endBoundary = end;

  for (let i = 0; i < domain.length; i++) {
    if (i === domain.length - 1) {
      blocks = [...blocks, [startBoundary, endBoundary]];
      break;
    }

    const nextDate = domain[i + 1];
    const [startNext, endNext] = getBlockBoundaries(nextDate, timeDensity);

    // Distance between the end of the current block and the start of the next.
    const distance = xScaled(startNext) - xScaled(endBoundary);

    if (distance < minBlockSize / 2) {
      endBoundary = endNext;
      continue;
    }

    blocks = [...blocks, [startBoundary, endBoundary]];
    startBoundary = startNext;
    endBoundary = endNext;
  }

  return { blocks, wasLumped: true };
}