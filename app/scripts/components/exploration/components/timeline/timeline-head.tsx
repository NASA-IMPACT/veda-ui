import React, { forwardRef, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { drag, ScaleTime, select } from 'd3';
import { clamp, format, startOfDay } from 'date-fns';
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

const TimelinePlayeadBase = styled.div`
  background-color: black;
  color: white;
  padding: 0 4px;
  border-radius: 4px;
  font-size: 0.75rem;
  position: relative;
`;

const TimelinePlayeadLeft = styled(TimelinePlayeadBase)`
  background-color: #8b8b8b;
  color: white;
  padding: 0 4px;
  border-radius: 4px;
  font-size: 0.75rem;
  position: absolute;
  transform: translateX(-100%);
  white-space: nowrap;
  left: 17px;
  min-width: 115px;
  text-align: center;
`;

const TimelinePlayeadRight = styled(TimelinePlayeadBase)`
  background-color: #8b8b8b;
  color: white;
  padding: 0 4px;
  border-radius: 4px;
  font-size: 0.75rem;
  position: relative;
  left: 15px;
  min-width: 115px;
  text-align: center;
`;

const TimelinePlayeadWithAfter = styled(TimelinePlayeadBase)`
  min-width: 100px;
  text-align: center;
  left: -35px;

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translateX(-40%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 3px solid black;
  }
`;

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
      <div ref={rectRef} style={{ transform: `translate(${xPos}px, -6px)`, position: 'absolute', pointerEvents: 'all' }}>
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
  const { label, selectedDay, ...rest } = props;

  return (
    <TimelineHeadBase selectedDay={selectedDay} {...rest}>
      <TimelinePlayeadWithAfter ref={ref}>
        <span style={{ pointerEvents: 'all', userSelect: 'none', fontWeight: 500}}>
          <span style={{ color: '#CCCCCC'}}>{label}</span> {format(selectedDay, 'MMM do, yyyy')}
        </span>
      </TimelinePlayeadWithAfter>
    </TimelineHeadBase>
  );
});

TimelineHeadPoint.displayName = 'TimelineHeadPoint';

export const TimelineHeadIn = forwardRef<HTMLDivElement, TimelineHeadProps>((props, ref) => {
  const { label, selectedDay, ...rest } = props;

  return (
    <TimelineHeadBase isStrokeDashed selectedDay={selectedDay} {...rest}>
      <TimelinePlayeadLeft ref={ref}>
        <span style={{ pointerEvents: 'all', transform: `translate(-14, -4)`, userSelect: 'none', fontWeight: 500}}>
          <span style={{ color: '#CCCCCC'}}>{label}</span> {format(selectedDay, 'MMM do, yyyy')}
        </span>
      </TimelinePlayeadLeft>
    </TimelineHeadBase>
  );
});

TimelineHeadIn.displayName = 'TimelineHeadIn';

export const TimelineHeadOut = forwardRef<HTMLDivElement, TimelineHeadProps>((props, ref) => {
  const { label, selectedDay, ...rest } = props;

  return (
    <TimelineHeadBase isStrokeDashed selectedDay={selectedDay} {...rest}>
      <TimelinePlayeadRight ref={ref}>
      <span style={{ pointerEvents: 'all', transform: `translate(-14, -4)`, userSelect: 'none', fontWeight: 500}}>
        <span style={{ color: '#CCCCCC'}}>{label}</span> {format(selectedDay, 'MMM do, yyyy')}
      </span>
      </TimelinePlayeadRight>
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
