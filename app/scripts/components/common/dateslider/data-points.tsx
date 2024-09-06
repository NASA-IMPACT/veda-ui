import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ScaleLinear, select, Selection } from 'd3';
import { themeVal } from '@devseed-ui/theme-provider';

import { findDate } from './utils';
import { DateSliderDataItem, DateSliderTimeDensity } from './constants';

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

  .data-point-break {
    fill: none;
    stroke: ${themeVal('color.base-200')};
  }
`;

const DataLineSelf = styled.line`
  stroke: ${themeVal('color.base-100')};
`;

type HighlightCircle = Selection<
  SVGCircleElement,
  DateSliderDataItem,
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

interface DataPointsProps {
  data: DateSliderDataItem[];
  hoveringDataPoint: Date | null;
  value?: Date;
  x: ScaleLinear<number, number>;
  zoomXTranslation: number;
  timeDensity: DateSliderTimeDensity;
}

export function DataPoints(props: DataPointsProps) {
  const { data, value, timeDensity, x, zoomXTranslation, hoveringDataPoint } =
    props;
  const container = useRef<SVGGElement>(null);

  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const rootG = select(container.current);

    const classAttr = (d, c) => {
      return hoveringDataPoint === d.index ? `${c} over` : c;
    };

    rootG
      .selectAll('circle.data-point')
      .data(data.filter((d) => d.hasData))
      .join('circle')
      .attr('class', (d) => classAttr(d, 'data-point'))
      .attr('cx', (d) => x(d.index))
      .attr('cy', 12)
      .attr('r', 4);

    rootG
      .selectAll('circle.data-point-valid')
      .data(data.filter((d) => d.hasData))
      .join('circle')
      .attr('class', (d) => classAttr(d, 'data-point-valid'))
      .attr('cx', (d) => x(d.index))
      .attr('cy', 12)
      .attr('r', 2);

    // Add a squiggly line to indicate there is a data break.
    rootG
      .selectAll('path.data-point-break')
      .data(data.filter((d) => d.breakLength))
      .join('path')
      .attr('class', (d) => classAttr(d, 'data-point-break'))
      .attr('d', (d) => {
        // Center point on the horizontal line. We draw a bit left and right.
        const h = x(d.index);
        return `M${h - 12} 12
          L${h - 9} 8
          L${h - 3} 16
          L${h + 3} 8
          L${h + 9} 16
          L${h + 12} 12`;
      });
  }, [data, x, hoveringDataPoint]);

  useEffect(() => {
    const rootG = select(container.current);

    const item = findDate(data, value, timeDensity);

    if (item) {
      let circle = rootG.select('.select-highlight') as HighlightCircle;

      if (circle.empty()) {
        circle = rootG
          .append('circle')
          .lower()
          .datum(item)
          .attr('class', 'select-highlight')
          .attr('cy', 12);
      }

      circle.attr('cx', (d) => x(d.index));

      // Animate or not.
      if (reduceMotion) {
        circle.attr('r', 6).style('opacity', 1);
      } else {
        circle.call(animateHighlight);
      }
    }

    return () => {
      if (item) {
        rootG.select('.select-highlight').remove();
      }
    };
  }, [data, value, timeDensity, x, reduceMotion]);

  return (
    <StyledG
      className='data-points'
      ref={container}
      transform={`translate(${zoomXTranslation}, 0)`}
    />
  );
}

interface DataLineProps {
  x: ScaleLinear<number, number>;
  zoomXTranslation: number;
}

export function DataLine(props: DataLineProps) {
  const { x, zoomXTranslation } = props;

  // The line should occupy the full scale.
  const [x1, x2] = x.range();

  return (
    <DataLineSelf
      className='data-line'
      x1={x1}
      y1={12}
      x2={x2}
      y2={12}
      transform={`translate(${zoomXTranslation}, 0)`}
    />
  );
}
