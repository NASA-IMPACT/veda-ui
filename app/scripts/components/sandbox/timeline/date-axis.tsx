import React from 'react';
import styled from 'styled-components';
import { ScaleTime } from 'd3';
import {
  format,
  isSameMonth,
  isSameYear,
  startOfMonth,
  startOfYear
} from 'date-fns';
import { themeVal } from '@devseed-ui/theme-provider';

const GridLine = styled.line`
  stroke: ${themeVal('color.base-200')};
`;

const DateAxisSVG = styled.svg`
  text {
    font-size: 0.75rem;
    fill: ${themeVal('color.base')};

    &.parent {
      font-size: 0.625rem;
    }
  }
`;

const GridSvg = styled.svg`
  position: absolute;
  right: 0;
  height: 100%;
  pointer-events: none;
`;

enum TimeDensity {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day'
}

function getTimeDensity(domain) {
  if (domain.every((d) => d.getTime() === startOfYear(d).getTime())) {
    return TimeDensity.YEAR;
  } else if (domain.every((d) => d.getTime() === startOfMonth(d).getTime())) {
    return TimeDensity.MONTH;
  } else {
    return TimeDensity.DAY;
  }
}

function timeDensityFormat(date: Date, timeDensity: TimeDensity) {
  switch (timeDensity) {
    case TimeDensity.YEAR:
      return format(date, 'yyyy');
    case TimeDensity.MONTH:
      return format(date, 'MMM dd');
    case TimeDensity.DAY:
      return format(date, 'iii dd');
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

interface DateAxisProps {
  xScaled: ScaleTime<number, number>;
  width: number;
}

export function DateAxis(props: DateAxisProps) {
  const { xScaled, width } = props;

  const ticks = getTicks(xScaled);
  const axisDensity = getTimeDensity(ticks);

  return (
    <DateAxisSVG className='date-axis' width={width} height={32}>
      {ticks.map((d) => {
        const xPos = xScaled(d);
        return (
          <React.Fragment key={d.getTime()}>
            <GridLine x1={xPos} x2={xPos} y1={0} y2={32} />
            <text y={0} x={xPos} dy='1em' dx={8}>
              {timeDensityFormat(d, axisDensity)}
            </text>
            <ParentIndicator
              timeDensity={axisDensity}
              date={d}
              domain={ticks}
              xScaled={xScaled}
            />
          </React.Fragment>
        );
      })}
    </DateAxisSVG>
  );
}

interface ParentIndicatorProps {
  timeDensity: TimeDensity;
  date: Date;
  domain: Date[];
  xScaled: ScaleTime<number, number>;
}

function ParentIndicator(props: ParentIndicatorProps) {
  const { timeDensity, date, domain, xScaled } = props;

  if (timeDensity === TimeDensity.YEAR) return <>{false}</>;

  let dateFormat: string;
  if (timeDensity === TimeDensity.MONTH) {
    // Only render the first date for a given month.
    // Get the first date that has the same month as the one being rendered and
    // check if they're the same.
    const firstDate = domain.find((d) => isSameYear(d, date));
    if (firstDate !== date) return <>{false}</>;

    dateFormat = 'yyyy';
  } else {
    const firstDate = domain.find((d) => isSameMonth(d, date));
    if (firstDate !== date) return <>{false}</>;

    dateFormat = 'MMM yyyy';
  }

  return (
    <text y={16} x={xScaled(date)} dy='1em' dx={8} className='parent'>
      {format(date, dateFormat)}
    </text>
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
