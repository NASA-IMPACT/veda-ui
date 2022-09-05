import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { select, Selection } from 'd3';
import { startOfDay, startOfMonth, startOfYear } from 'date-fns';
import { themeVal } from '@devseed-ui/theme-provider';

import { useTimeseriesContext } from './context';
import useReducedMotion from '$utils/use-prefers-reduced-motion';

const StyledG = styled.g`
  .data-point {
    fill: #fff;
    stroke-width: 1px;
    stroke: ${themeVal('color.base-100')};
    transition: fill 160ms ease-in;

    &.over {
      fill: ${themeVal('color.base')};
    }
  }

  .data-point-valid {
    fill: ${themeVal('color.base')};
  }

  .select-highlight {
    fill: none;
    stroke-width: 2px;
    stroke: ${themeVal('color.base')};
  }
`;

const DataLineSelf = styled.line`
  stroke: ${themeVal('color.base-100')};
`;

type HighlightCircle = Selection<
  SVGCircleElement,
  Date,
  SVGGElement | null,
  unknown
>;

function animateHighlight(circle: HighlightCircle) {
  return circle
    .attr('r', 1)
    .style('opacity', 1)
    .transition()
    .duration(1500)
    .style('opacity', 0)
    .attr('r', 10)
    .on('end', () => animateHighlight(circle));
}

const startOfTimeDensity = {
  year: startOfYear,
  month: startOfMonth,
  day: startOfDay
};

export function DataPoints() {
  const { data, value, timeDensity, x, zoomXTranslation, hoveringDataPoint } =
    useTimeseriesContext();
  const container = useRef<SVGGElement>(null);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const rootG = select(container.current);

    const classAttr = (d, c) => {
      return hoveringDataPoint === d.date ? `${c} over` : c;
    };

    rootG
      .selectAll('circle.data-point')
      .data(data.filter((d) => d.hasData))
      .join('circle')
      .attr('class', (d) => classAttr(d, 'data-point'))
      .attr('cx', (d) => x(d.date))
      .attr('cy', 12)
      .attr('r', 4);

    rootG
      .selectAll('circle.data-point-valid')
      .data(data.filter((d) => d.hasData))
      .join('circle')
      .attr('class', (d) => classAttr(d, 'data-point-valid'))
      .attr('cx', (d) => x(d.date))
      .attr('cy', 12)
      .attr('r', 2);
  }, [data, x, hoveringDataPoint]);

  useEffect(() => {
    const rootG = select(container.current);

    const val = value ? startOfTimeDensity[timeDensity](value) : null;

    if (val) {
      let circle = rootG.select('.select-highlight') as HighlightCircle;

      if (circle.empty()) {
        circle = rootG
          .append('circle')
          .lower()
          .datum(val)
          .attr('class', 'select-highlight')
          .attr('cy', 12);
      }

      circle.attr('cx', (d) => x(d));

      // Animate or not.
      if (reduceMotion) {
        circle.attr('r', 6).style('opacity', 1);
      } else {
        circle.call(animateHighlight);
      }
    }

    return () => {
      if (val) {
        rootG.select('.select-highlight').remove();
      }
    };
  }, [value, timeDensity, x, reduceMotion]);

  return (
    <StyledG
      className='data-points'
      ref={container}
      transform={`translate(${zoomXTranslation}, 0)`}
    />
  );
}

export function DataLine() {
  const { data, x, zoomXTranslation } = useTimeseriesContext();

  return (
    <DataLineSelf
      className='data-line'
      x1={x(data[0].date)}
      y1={12}
      x2={x(data.last.date)}
      y2={12}
      transform={`translate(${zoomXTranslation}, 0)`}
    />
  );
}
