import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { select } from 'd3';

import { useTimeseriesContext } from './context';
import { format } from 'date-fns';

const StyledG = styled.g`
  .date-value {
    fill: ${themeVal('color.base-400')};
    font-size: 0.625rem;
    font-weight: ${themeVal('type.base.bold')};
  }
`;

export default function DateAxis() {
  const { data, x, zoomXTranslation } = useTimeseriesContext();
  const container = useRef<SVGGElement>(null);

  useEffect(() => {
    const rootG = select(container.current);

    rootG
      .selectAll('text.date-value')
      .data(data)
      .join('text')
      .attr('class', 'date-value')
      .attr('x', (d) => x(d.date))
      .attr('y', 32)
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .text((d) => format(d.date, 'MMM'));
  }, [data, x]);

  return (
    <StyledG
      className='x axis'
      ref={container}
      transform={`translate(${zoomXTranslation}, 0)`}
    />
  );
}
