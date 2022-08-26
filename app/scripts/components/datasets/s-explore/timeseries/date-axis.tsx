import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { select } from 'd3';
import { format } from 'date-fns';
import { themeVal } from '@devseed-ui/theme-provider';

import { useTimeseriesContext } from './context';

const timeFormat = {
  day: 'dd',
  month: 'MMM',
  year: 'yyyy'
};

const parentTimeFormat = {
  day: 'MMM yyyy',
  month: 'yyyy'
};

const parentSearchFormat = {
  day: 'yyyy-MM',
  month: 'yyyy'
};

const StyledG = styled.g`
  .date-value,
  .date-parent-value {
    fill: ${themeVal('color.base-400')};
    font-size: 0.625rem;
    font-weight: ${themeVal('type.base.bold')};
  }
`;

export function DateAxis() {
  const { data, x, zoomXTranslation, timeUnit } = useTimeseriesContext();
  const dateGRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const dateG = select(dateGRef.current);

    dateG
      .selectAll('text.date-value')
      .data(data)
      .join('text')
      .attr('class', 'date-value')
      .attr('x', (d) => x(d.date))
      .attr('y', 16)
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .text((d) => format(d.date, timeFormat[timeUnit]));
  }, [data, x, timeUnit]);

  return (
    <StyledG
      className='x axis'
      ref={dateGRef}
      transform={`translate(${zoomXTranslation}, 0)`}
    />
  );
}

export function DateAxisParent() {
  const { data, x, zoomXTranslation, timeUnit } = useTimeseriesContext();
  const parentGref = useRef<SVGGElement>(null);

  useEffect(() => {
    const parentG = select(parentGref.current);
    // There's no parent for the year time unit.
    if (timeUnit === 'year') {
      parentG.selectAll('text.date-parent-value').remove();
    } else {
      const uniqueYears = data.reduce((acc, { date }) => {
        const exists = acc.find((d) => {
          return (
            format(d, parentSearchFormat[timeUnit]) ===
            format(date, parentSearchFormat[timeUnit])
          );
        });
        return exists ? acc : acc.concat(date);
      }, [] as Date[]);

      parentG
        .selectAll('text.date-parent-value')
        .data(uniqueYears)
        .join('text')
        .attr('class', 'date-parent-value')
        .attr('y', 30)
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .text((d) => format(d, parentTimeFormat[timeUnit]));
    }
  }, [data, x, timeUnit]);

  useEffect(() => {
    select(parentGref.current)
      .selectAll<SVGTextElement, Date>('text.date-parent-value')
      .each((d, i, n) => {
        // Expected position of this node.
        const expectedPosition = x(d);
        const expectedAfterTrans = expectedPosition + zoomXTranslation;

        let maxPos = Infinity;
        if (n[i + 1]) {
          // Width of current node.
          const { width: nodeW } = n[i].getBBox();
          // Position of the next item.
          const nextItemPos =
            x(select<SVGTextElement, Date>(n[i + 1]).datum()) +
            zoomXTranslation;

          // Include some padding
          maxPos = nextItemPos - nodeW;
        }

        const xTrans = Math.min(Math.max(expectedAfterTrans, 32), maxPos);
        select(n[i]).attr('x', xTrans);
      });
  }, [zoomXTranslation, x]);

  return <StyledG className='x axis' ref={parentGref} />;
}
