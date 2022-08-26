import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { select } from 'd3';

import { useTimeseriesContext } from './context';
import { CHART_HEIGHT } from './constants';

const StyledG = styled.g`
  .data-point {
    fill: #fff;
    stroke-width: 1px;
    stroke: grey;
  }

  .data-point-valid {
    fill: black;
  }
`;

export function DataPoints() {
  const { data, x, zoomXTranslation } = useTimeseriesContext();
  const container = useRef<SVGGElement>(null);

  useEffect(() => {
    const rootG = select(container.current);

    rootG
      .selectAll('circle.data-point')
      .data(data)
      .join('circle')
      .attr('class', 'data-point')
      .attr('cx', (d) => x(d.date))
      .attr('cy', CHART_HEIGHT / 2)
      .attr('r', 4);

    rootG
      .selectAll('circle.data-point-valid')
      .data(data.filter((d) => d.hasData))
      .join('circle')
      .attr('class', 'data-point-valid')
      .attr('cx', (d) => x(d.date))
      .attr('cy', CHART_HEIGHT / 2)
      .attr('r', 2);
  }, [data, x]);

  return (
    <StyledG
      className='data-points'
      ref={container}
      transform={`translate(${zoomXTranslation}, 0)`}
    />
  );
}

export function DataLine() {
  const { height, data, x, zoomXTranslation } = useTimeseriesContext();

  return (
    <line
      className='data-line'
      x1={0}
      y1={height / 2}
      x2={x(data.last.date)}
      y2={height / 2}
      stroke='black'
      transform={`translate(${zoomXTranslation}, 0)`}
    />
  );
}
