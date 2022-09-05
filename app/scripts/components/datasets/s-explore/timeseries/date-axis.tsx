import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { select } from 'd3';
import { format } from 'date-fns';
import { themeVal } from '@devseed-ui/theme-provider';
import { createSubtitleStyles } from '@devseed-ui/typography';

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
    ${createSubtitleStyles()}
    fill: ${themeVal('color.base-400')};
    font-size: 0.75rem;
    line-height: 1rem;
  }
`;

export function DateAxis() {
  const { data, x, zoomXTranslation, timeDensity } = useTimeseriesContext();
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
      .text((d) => format(d.date, timeFormat[timeDensity]));
  }, [data, x, timeDensity]);

  return (
    <StyledG
      className='x axis'
      ref={dateGRef}
      transform={`translate(${zoomXTranslation}, 0)`}
    />
  );
}

export function DateAxisParent() {
  const { data, x, zoomXTranslation, timeDensity } = useTimeseriesContext();
  const parentGref = useRef<SVGGElement>(null);

  useEffect(() => {
    const parentG = select(parentGref.current);
    // There's no parent for the year time unit.
    if (timeDensity === 'year') {
      parentG.selectAll('text.date-parent-value').remove();
    } else {
      const uniqueParent = data.reduce((acc, { date }) => {
        const exists = acc.find((d) => {
          return (
            format(d, parentSearchFormat[timeDensity]) ===
            format(date, parentSearchFormat[timeDensity])
          );
        });
        return exists ? acc : acc.concat(date);
      }, [] as Date[]);

      parentG
        .selectAll('text.date-parent-value')
        .data(uniqueParent)
        .join('text')
        .attr('class', 'date-parent-value')
        .attr('y', 30)
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .text((d) => format(d, parentTimeFormat[timeDensity]));
    }
  }, [data, x, timeDensity]);

  useEffect(() => {
    select(parentGref.current)
      .selectAll<SVGTextElement, Date>('text.date-parent-value')
      .each((d, i, n) => {
        // Expected position of this node.
        const expectedPosition = x(d);
        const expectedAfterTrans = expectedPosition + zoomXTranslation;

        const nextNode = n[i + 1];

        let maxPos = Infinity;
        // If there's a node after this one, that node will push on this one, so
        // the max "x" position for this node will be start of the next.
        if (nextNode) {
          // Width of current node.
          const { width: nextNodeW } = nextNode.getBBox();
          // Position of the next item.
          const nextItemPos =
            x(select<SVGTextElement, Date>(nextNode).datum()) +
            zoomXTranslation;

          maxPos = nextItemPos - nextNodeW;
        }

        // The node should stay close to the left, so we get the width / 2
        // because of text anchor middle. Add 4px for spacing.
        const leftPadding = n[i].getBBox().width / 2 + 4;

        const xTrans = Math.min(Math.max(expectedAfterTrans, leftPadding), maxPos);
        select(n[i]).attr('x', xTrans);
      });
  }, [zoomXTranslation, x]);

  return <StyledG className='x axis' ref={parentGref} />;
}
