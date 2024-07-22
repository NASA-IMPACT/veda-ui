import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { drag, ScaleTime, select } from 'd3';
import { clamp, startOfDay } from 'date-fns';
import { themeVal } from '@devseed-ui/theme-provider';

import { RIGHT_AXIS_SPACE } from '$components/exploration/constants';
import { DateRange } from '$components/exploration/types.d.ts';

// Needs padding so that the timeline head is fully visible.
// This value gets added to the width.
const SVG_PADDING = 16;

const TimelineHeadSVG = styled.svg`
  position: absolute;
  right: ${RIGHT_AXIS_SPACE - SVG_PADDING}px;
  top: -1rem;
  height: calc(100% + 1rem);
  pointer-events: none;
  z-index: ${themeVal('zIndices.overlay' as any)};
`;

const dropShadowFilter =
  'drop-shadow(0px 2px 2px rgba(44, 62, 80, 0.08)) drop-shadow(0px 0px 4px rgba(44, 62, 80, 0.08))';

interface TimelineHeadBaseProps {
  domain: [Date, Date];
  xScaled: ScaleTime<number, number>;
  selectedDay: Date;
  width: number;
  onDayChange: (date: Date) => void;
  isStrokeDashed?: boolean;
  children: React.ReactNode;
  'data-tour'?: string;
}

type TimelineHeadProps = Omit<TimelineHeadBaseProps, 'children'> & {
  label?: string;
};

export function TimelineHeadBase(props: TimelineHeadBaseProps) {
  const { domain, xScaled, selectedDay, width, onDayChange, isStrokeDashed, children } = props;

  const theme = useTheme();
  const rectRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    if (!rectRef.current) return;

    const dragger = drag()
      .on('start', function dragstarted() {
        // document.body.style.cursor = 'grabbing';
        select(this).attr('cursor', 'grabbing');
      })
      .on('drag', function dragged(event) {
        if (event.x < 0 || event.x > width) {
          return;
        }

        const dx = event.x - event.subject.x;
        const currPos = xScaled(selectedDay);
        const newPos = currPos + dx;

        const dateFromPos = startOfDay(xScaled.invert(newPos));

        const [start, end] = domain;
        const interval = { start, end };

        const newDate = clamp(dateFromPos, interval);

        if (selectedDay.getTime() !== newDate.getTime()) {
          onDayChange(newDate);
        }
      })
      .on('end', function dragended() {
        // document.body.style.cursor = '';
        select(this).attr('cursor', 'grab');
      });

    select(rectRef.current).call(dragger);
  }, [width, domain, selectedDay, onDayChange, xScaled]);

  const xPos = xScaled(selectedDay);

  if (xPos < 0 || xPos > width) return null;

  return (
    <TimelineHeadSVG width={width + SVG_PADDING * 2}>
      <g
        transform={`translate(${SVG_PADDING}, 0)`}
        data-tour={props['data-tour']}
      >
        <line
          x1={xPos}
          x2={xPos}
          y1={0}
          y2='100%'
          stroke={theme.color?.base}
          strokeDasharray={isStrokeDashed ? 2 : 'none'}
        />
        <g transform={`translate(${xPos}, 0)`} ref={rectRef}>
          {children}
        </g>
      </g>
    </TimelineHeadSVG>
  );
}

export function TimelineHeadPoint(props: TimelineHeadProps) {
  const theme = useTheme();
  const { label, ...rest } = props;

  return (
    <TimelineHeadBase {...rest}>
      <path
        transform='translate(-14, -4)'
        d='M4 14.6459C4 15.4637 4.4979 16.1992 5.25722 16.5029L13.2572 19.7029C13.734 19.8936 14.266 19.8936 14.7428 19.7029L22.7428 16.5029C23.5021 16.1992 24 15.4637 24 14.6459L24 6C24 4.89543 23.1046 4 22 4L6 4C4.89543 4 4 4.89543 4 6L4 14.6459Z'
        fill={theme.color?.surface}
        stroke={theme.color?.['base-200']}
        style={{
          filter: dropShadowFilter,
          pointerEvents: 'all'
        }}
      />
      <text fill={theme.color?.base} fontSize='0.75rem' y='0' x='-4' dy='1em'>
        {label}
      </text>
    </TimelineHeadBase>
  );
}

export function TimelineHeadIn(props: TimelineHeadProps) {
  const theme = useTheme();
  const { label, ...rest } = props;

  return (
    <TimelineHeadBase isStrokeDashed {...rest}>
      <path
        transform='translate(-6, -4)'
        d='M4 6C4 4.89543 4.89543 4 6 4H15.1716C15.702 4 16.2107 4.21071 16.5858 4.58579L22.5858 10.5858C23.3668 11.3668 23.3668 12.6332 22.5858 13.4142L16.5858 19.4142C16.2107 19.7893 15.702 20 15.1716 20H6C4.89543 20 4 19.1046 4 18V6Z'
        fill={theme.color?.surface}
        stroke={theme.color?.['base-200']}
        style={{
          filter: dropShadowFilter,
          pointerEvents: 'all'
        }}
      />
      <text fill={theme.color?.base} fontSize='0.75rem' y='0' x='2' dy='1em'>
        {label}
      </text>
    </TimelineHeadBase>
  );
}

export function TimelineHeadOut(props: TimelineHeadProps) {
  const theme = useTheme();
  const { label, ...rest } = props;

  return (
    <TimelineHeadBase isStrokeDashed {...rest}>
      <path
        transform='translate(-22, -4)'
        d='M24 6C24 4.89543 23.1046 4 22 4H12.8284C12.298 4 11.7893 4.21071 11.4142 4.58579L5.41421 10.5858C4.63316 11.3668 4.63317 12.6332 5.41421 13.4142L11.4142 19.4142C11.7893 19.7893 12.298 20 12.8284 20H22C23.1046 20 24 19.1046 24 18V6Z'
        fill={theme.color?.surface}
        stroke={theme.color?.['base-200']}
        style={{
          filter: dropShadowFilter,
          pointerEvents: 'all'
        }}
      />
      <text
        fill={theme.color?.base}
        fontSize='0.75rem'
        y='0'
        x='-2'
        dy='1em'
        textAnchor='end'
      >
        {label}
      </text>
    </TimelineHeadBase>
  );
}

const TimelineRangeTrackSelf = styled.div`
  position: absolute;
  top: 0;
  right: ${RIGHT_AXIS_SPACE}px;
  overflow: hidden;
  background: ${themeVal('color.base-100a')};
  height: 100%;

  .shaded {
    position: relative;
    background: #ffffff;
    height: 100%;
  }
`;

interface TimelineRangeTrackProps {
  range: DateRange;
  xScaled: ScaleTime<number, number>;
  width: number;
}

export function TimelineRangeTrack(props: TimelineRangeTrackProps) {
  const { range, xScaled, width } = props;

  const start = xScaled(range.start);
  const end = xScaled(range.end);

  return (
    <TimelineRangeTrackSelf style={{ width }}>
      <div
        className='shaded'
        style={{
          width: end - start,
          left: start
        }}
      />
    </TimelineRangeTrackSelf>
  );
}
