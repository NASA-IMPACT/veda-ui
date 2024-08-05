import React, { useMemo } from 'react';
import styled from 'styled-components';
import { ScaleTime } from 'd3';
import {
  format, startOfMonth,
  startOfYear
} from 'date-fns';
import { themeVal } from '@devseed-ui/theme-provider';

import { RIGHT_AXIS_SPACE } from '$components/exploration/constants';
import { TimeDensity } from '$components/exploration/types.d.ts';

const GridLine = styled.line`
  stroke: ${themeVal('color.base-200')};
`;

const DateAxisSVG = styled.svg`
  border-top: 1px solid ${themeVal('color.base-200')};

  text {
    font-size: 0.75rem;
    fill: ${themeVal('color.base')};
  }
`;

const GridSvg = styled.svg`
  position: absolute;
  right: ${RIGHT_AXIS_SPACE}px;
  height: 100%;
  pointer-events: none;
`;

function getTimeDensity(domain) {
  if (domain.every((d) => d.getTime() === startOfYear(d).getTime())) {
    return TimeDensity.YEAR;
  } else if (domain.every((d) => d.getTime() === startOfMonth(d).getTime())) {
    return TimeDensity.MONTH;
  } else {
    return TimeDensity.DAY;
  }
}

function dateAxisLabelFormat(date: Date, timeDensity: TimeDensity) {
  switch (timeDensity) {
    case TimeDensity.YEAR:
      return format(date, 'yyyy');
    case TimeDensity.MONTH:
      return format(date, 'MMM');
    case TimeDensity.DAY:
      return format(date, 'dd');
  }
}

/**
 * Returns date ticks that are spaced out enough to be readable taking into
 * account a minimum width for each tick of 60px.
 * If the width of each tick is less than 60px, every other tick is returned.
 *
 * @param scale The scale to get the ticks from.
 * @returns Date[]
 */
function getTicks(scale: ScaleTime<number, number>) {
  const [min, max] = scale.range();
  const width = max - min;

  return scale
    .ticks()
    .filter((v, i, a) => (width / a.length < 60 ? !(i % 2) : true));
}

/**
 * Generates minor ticks for the date axis based on the major ticks and time density.
 * Minor ticks are shown between major ticks and provide finer granularity on the timeline.

 * @param {ScaleTime<number, number>} scale - The scale function for the timeline, mapping dates to pixel positions.
 * @param {Date[]} majorTicks - The major tick points on the timeline (e.g., start of the month).
 * @param {TimeDensity} timeDensity - The density of the timeline aka the level of detail (e.g., year, month, day).
 * @returns {Date[]} - An array of minor tick dates.
 */
function getMinorTicks(scale: ScaleTime<number, number>, majorTicks: Date[], timeDensity: TimeDensity): Date[] {
  if (timeDensity === TimeDensity.DAY) {
    return [];
  }

  const [viewStart, viewEnd] = scale.domain();

  // Number of segments to divide the interval between major ticks
  // Set to 10 to for a balance between the level of detail, but also
  // it offers a better alignment of the timeline playhead over the
  // minor ticks.
  const segments = 10;

  // Ensure there are at least two major ticks to define an interval
  if (majorTicks.length < 2) {
    return [];
  }

  // Calculate the interval between minor ticks based on the first two major ticks
  const minorTickInterval = (majorTicks[1].getTime() - majorTicks[0].getTime()) / segments;

  // Initialize minorTicks as an array of Date objects
  let minorTicks: Date[] = [];

  // Add minor ticks before the first major tick (left hand side of
  // the timeline) until reaching the view start
  let tickTime = majorTicks[0].getTime() - minorTickInterval;

  while (tickTime > viewStart.getTime()) {
    minorTicks = [new Date(tickTime), ...minorTicks];
    tickTime -= minorTickInterval;
  }

  // Add minor ticks between each pair of major ticks on the timeline
  for (let i = 0; i < majorTicks.length - 1; i++) {
    const start = majorTicks[i].getTime();
    const end = majorTicks[i + 1].getTime();
    for (let j = 1; j < segments; j++) {
      tickTime = start + minorTickInterval * j;
      if (tickTime < end) {
        minorTicks = [...minorTicks, new Date(tickTime)];
      }
    }
  }

  // Add minor ticks after the last major tick (right hand side of
  // the timeline) until reaching the timeline end
  tickTime = majorTicks[majorTicks.length - 1].getTime() + minorTickInterval;
  while (tickTime < viewEnd.getTime()) {
    minorTicks = [...minorTicks, new Date(tickTime)];
    tickTime += minorTickInterval;
  }

  return minorTicks;
}

interface DateAxisProps {
  xScaled: ScaleTime<number, number>;
  width: number;
}

export function DateAxis(props: DateAxisProps) {
  const { xScaled, width } = props;

  const majorTicks = useMemo(() => getTicks(xScaled), [xScaled]);
  const axisDensity = useMemo(() => getTimeDensity(majorTicks), [majorTicks]);
  const minorTicks = useMemo(() => getMinorTicks(xScaled, majorTicks, axisDensity), [xScaled, majorTicks, axisDensity]);

  return (
    <DateAxisSVG className='date-axis' width={width} height={32}>
      {minorTicks.map((d: Date) => {
        const xPos = xScaled(d);
        return (
          <GridLine
            key={`minor-${d.getTime()}`}
            x1={xPos}
            x2={xPos}
            y1={24}
            y2={32}
          />
        );
      })}
      {majorTicks.map((d) => {
        const xPos = xScaled(d);
        return (
          <React.Fragment key={`major-${d.getTime()}`}>
            <GridLine x1={xPos} x2={xPos} y1={24} y2={32} />
            <text y={0} x={xPos} dy='1.5em' dx={0} textAnchor='middle'>
              {dateAxisLabelFormat(d, axisDensity)}
            </text>
          </React.Fragment>
        );
      })}
    </DateAxisSVG>
  );
}

interface DateGridProps {
  xScaled: ScaleTime<number, number>;
  width: number;
}

export function DateGrid(props: DateGridProps) {
  const { width, xScaled } = props;

  return (
    <GridSvg width={width}>
      {getTicks(xScaled).map((tick) => {
        const xPos = xScaled(tick);
        return (
          <GridLine
            key={tick.getTime()}
            x1={xPos}
            x2={xPos}
            y1='0%'
            y2='100%'
          />
        );
      })}
    </GridSvg>
  );
}
