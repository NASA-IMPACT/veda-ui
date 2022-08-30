import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { select, Selection } from 'd3';
import { startOfDay, startOfMonth, startOfYear } from 'date-fns';

import { useTimeseriesContext } from './context';

const StyledG = styled.g`
  .data-point {
    fill: #fff;
    stroke-width: 1px;
    stroke: grey;
  }

  .data-point-valid {
    fill: black;
  }

  .select-highlight {
    fill: none;
    stroke-width: 2px;
    stroke: black;
  }
`;

type HighlightCircle = Selection<SVGCircleElement, Date, SVGGElement | null, unknown>;

function animateHighlight(
  circle: HighlightCircle
) {
  return circle
    .attr('r', 1)
    .style('opacity', 1)
    .transition()
    .duration(1500)
    .style('opacity', 0)
    .attr('r', 10)
    .on('end', () => animateHighlight(circle));
}

const startOfTimeUnit = {
  year: startOfYear,
  month: startOfMonth,
  day: startOfDay
};

export function DataPoints() {
  const { data, value, timeUnit, x, zoomXTranslation } = useTimeseriesContext();
  const container = useRef<SVGGElement>(null);

  useEffect(() => {
    const rootG = select(container.current);

    rootG
      .selectAll('circle.data-point')
      .data(data.filter((d) => d.hasData))
      .join('circle')
      .attr('class', 'data-point')
      .attr('cx', (d) => x(d.date))
      .attr('cy', 12)
      .attr('r', 4);

    rootG
      .selectAll('circle.data-point-valid')
      .data(data.filter((d) => d.hasData))
      .join('circle')
      .attr('class', 'data-point-valid')
      .attr('cx', (d) => x(d.date))
      .attr('cy', 12)
      .attr('r', 2);
  }, [data, x]);

  useEffect(() => {
    const rootG = select(container.current);

    const val = value ? startOfTimeUnit[timeUnit](value) : null;

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

      circle
      .attr('cx', (d) => x(d))
      .call(animateHighlight);
    }

    return () => {
      if (val) {
        rootG.select('.select-highlight').remove();
      }
    };
  }, [value, timeUnit, x]);

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
    <line
      className='data-line'
      x1={x(data[0].date)}
      y1={12}
      x2={x(data.last.date)}
      y2={12}
      stroke='black'
      transform={`translate(${zoomXTranslation}, 0)`}
    />
  );
}
