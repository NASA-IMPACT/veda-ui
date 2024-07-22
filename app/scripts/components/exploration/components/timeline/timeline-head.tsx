import React, { forwardRef, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { drag, ScaleTime, select } from 'd3';
import { clamp, startOfDay } from 'date-fns';
import { themeVal } from '@devseed-ui/theme-provider';

import { RIGHT_AXIS_SPACE } from '$components/exploration/constants';
import { DateRange } from '$components/exploration/types.d.ts';

// Needs padding so that the timeline head is fully visible.
// This value gets added to the width.
const SVG_PADDING = 16;

const TimelineHeadSVG = styled.div`
  position: absolute;
  right: ${RIGHT_AXIS_SPACE - SVG_PADDING}px;
  top: -1rem;
  height: calc(100% + 1rem);
  pointer-events: none;
  z-index: ${themeVal('zIndices.overlay' as any)};
`;

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
  const rectRef = useRef<any>(null);

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
    <TimelineHeadSVG style={{width: width + SVG_PADDING * 2, pointerEvents: 'none'}}>
      <div
          style={{ transform: `translate(${xPos}px, 0)`, position: 'absolute', pointerEvents: 'all' }}
          ref={rectRef}
      >
          {children}
      </div>
      <svg style={{width: width + SVG_PADDING * 2, height: '100%'}}>
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
        </g>
      </svg>
    </TimelineHeadSVG>
  );
}

export const TimelineHeadPoint = forwardRef<HTMLDivElement, TimelineHeadProps>((props, ref) => {
  const theme = useTheme();
  const { label, ...rest } = props;

  return (
    <TimelineHeadBase {...rest}>
      <div ref={ref}>
        <span style={{ backgroundColor: 'red', pointerEvents: 'all', transform: `translate(-14, -4)`, userSelect: 'none'}}>Test</span>
        <text fill={theme.color?.base} fontSize='0.75rem' y='0' x='-4' dy='1em'>
          {label}
        </text>
      </div>
    </TimelineHeadBase>
  );
});

TimelineHeadPoint.displayName = 'TimelineHeadPoint';

export const TimelineHeadIn = forwardRef<HTMLDivElement, TimelineHeadProps>((props, ref) => {
  const theme = useTheme();
  const { label, ...rest } = props;

  return (
    <TimelineHeadBase isStrokeDashed {...rest}>
      <div ref={ref}>
        <span style={{ backgroundColor: 'red', pointerEvents: 'all', transform: `translate(-14, -4)`, userSelect: 'none'}}>In</span>
        <text fill={theme.color?.base} fontSize='0.75rem' y='0' x='2' dy='1em'>
          {label}
        </text>
      </div>
    </TimelineHeadBase>
  );
});

TimelineHeadIn.displayName = 'TimelineHeadIn';

export const TimelineHeadOut = forwardRef<HTMLDivElement, TimelineHeadProps>((props, ref) => {
  const theme = useTheme();
  const { label, ...rest } = props;

  return (
    <TimelineHeadBase isStrokeDashed {...rest}>
      <div ref={ref}>
      <span style={{ backgroundColor: 'red', pointerEvents: 'all', transform: `translate(-14, -4)`, userSelect: 'none'}}>Out</span>
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
      </div>
    </TimelineHeadBase>
  );
});

TimelineHeadOut.displayName = 'TimelineHeadOut';

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
