import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ScaleLinear, select } from 'd3';
import { format } from 'date-fns';
import { themeVal } from '@devseed-ui/theme-provider';
import { createSubtitleStyles } from '@devseed-ui/typography';

import { DateSliderDataItem, DateSliderTimeDensity } from './constants';

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

interface DateAxisProps {
  data: DateSliderDataItem[];
  x: ScaleLinear<number, number, never>;
  zoomXTranslation: number;
  timeDensity: DateSliderTimeDensity;
}

export function DateAxis(props: DateAxisProps) {
  const { data, x, zoomXTranslation, timeDensity } = props;
  const dateGRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const dateG = select(dateGRef.current);

    dateG
      .selectAll('text.date-value')
      .data(data.filter((d) => !d.breakLength))
      .join('text')
      .attr('class', 'date-value')
      .attr('x', (d) => x(d.index))
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

interface DateAxisParentProps {
  data: DateSliderDataItem[];
  x: ScaleLinear<number, number, never>;
  zoomXTranslation: number;
  timeDensity: DateSliderTimeDensity;
}

export function DateAxisParent(props: DateAxisParentProps) {
  const { data, x, zoomXTranslation, timeDensity } = props;
  const parentGref = useRef<SVGGElement>(null);

  useEffect(() => {
    const parentG = select(parentGref.current);
    // There's no parent for the year time unit.
    if (timeDensity === 'year') {
      parentG.selectAll('text.date-parent-value').remove();
    } else {
      const uniqueParent = data.reduce<DateSliderDataItem[]>((acc, item) => {
        const { date } = item;
        const formatStr = parentSearchFormat[timeDensity];

        const exists = acc.find(
          (d) => format(d.date, formatStr) === format(date, formatStr)
        );

        return exists ? acc : acc.concat(item);
      }, []);

      parentG
        .selectAll('text.date-parent-value')
        .data(uniqueParent)
        .join('text')
        .attr('class', 'date-parent-value')
        .attr('y', 30)
        .attr('dy', '1em')
        .attr('text-anchor', d => {
          const isLastElement = d.index === x.domain()[1];
          return isLastElement ? 'end' : 'middle';
        })
        .attr('dx', d => {
          const isLastElement = d.index === x.domain()[1];
          return isLastElement ? '1em' : '';
        })
        .text((d) => format(d.date, parentTimeFormat[timeDensity]));
    }
  }, [data, x, timeDensity]);

  useEffect(() => {
    select(parentGref.current)
      .selectAll<SVGTextElement, DateSliderDataItem>('text.date-parent-value')
      .each((d, i, n) => {
        // Expected position of this node.
        const expectedPosition = x(d.index);
        const expectedAfterTrans = expectedPosition + zoomXTranslation;

        const nextNode = n[i + 1] as SVGTextElement | undefined;

        let maxPos = Infinity;
        // If there's a node after this one, that node will push on this one, so
        // the max "x" position for this node will be start of the next.
        if (nextNode) {
          // Width of current node.
          const { width: nextNodeW } = nextNode.getBBox();
          // Position of the next item.
          const nextItemData = select<SVGTextElement, DateSliderDataItem>(
            nextNode
          ).datum();
          const nextItemPos = x(nextItemData.index) + zoomXTranslation;

          maxPos = nextItemPos - nextNodeW;
        }

        // The node should stay close to the left, so we get the width / 2
        // because of text anchor middle. Add 4px for spacing.
        const leftPadding = n[i].getBBox().width / 2 + 4;

        const xTrans = Math.min(
          Math.max(expectedAfterTrans, leftPadding),
          maxPos
        );
        select(n[i]).attr('x', xTrans);
      });
  }, [zoomXTranslation, x]);

  return <StyledG className='x axis' ref={parentGref} />;
}
