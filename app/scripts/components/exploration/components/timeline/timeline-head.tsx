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

const TimelineHeadWrapper = styled.div`
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
  xPosOffset?: number;
  zIndex?: number;
}

const TimelinePlayheadBase = styled.div`
  background-color: #333333;
  color: #ffffff;
  padding: 0 4px;
  border-radius: 4px;
  font-size: 0.75rem;
  position: relative;
`;

const TimelinePlayheadLeft = styled(TimelinePlayheadBase)`
  background-color: #8b8b8b;
  color: #ffffff;
  padding: 0 4px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 0;
  font-size: 0.75rem;
  position: absolute;
  transform: translateX(-100%);
  white-space: nowrap;
  left: 16px;
  min-width: 115px;
  text-align: center;
`;

const TimelinePlayheadRight = styled(TimelinePlayheadBase)`
  background-color: #8b8b8b;
  color: #ffffff;
  padding: 0 4px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 0;
  font-size: 0.75rem;
  position: relative;
  right: 0;
  min-width: 115px;
  text-align: center;
`;

const TimelinePlayheadWithAfter = styled(TimelinePlayheadBase)`
  min-width: 110px;
  text-align: center;
  left: 0;

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: translateX(-44%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #333333;
  }
`;

const TimelinePlayheadLabel = styled.span`
  color: #cccccc;
  margin-right: 5px;
`;

const TimelinePlayheadContent = styled.span`
  pointer-events: all;
  user-select: none;
  font-weight: 500;
  transform: translate(-14px, -4px);
  white-space: nowrap;
  position: relative;
  z-index: 1;
`;

type TimelineHeadProps = Omit<TimelineHeadBaseProps, 'children'> & {
  label?: string;
};

export function TimelineHeadBase(props: TimelineHeadBaseProps) {
  const { domain, xScaled, selectedDay, width, onDayChange, xPosOffset = 0, zIndex = themeVal('zIndices.overlay'), isStrokeDashed, children } = props;

  const theme = useTheme();
  const rectRef = useRef<HTMLDivElement>(null);

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
        select(this).attr('cursor', 'grab');
      });

    select(rectRef.current).call(dragger);
  }, [width, domain, selectedDay, onDayChange, xScaled]);

  const xPos = xScaled(selectedDay);

  if (xPos < 0 || xPos > width) return null;

  return (
    <TimelineHeadWrapper style={{width: width + SVG_PADDING * 2, pointerEvents: 'none', zIndex: zIndex as number}}>
      <div data-tour={props['data-tour']} ref={rectRef} style={{ transform: `translate(${xPos - xPosOffset}px, -6px)`, position: 'absolute', pointerEvents: 'all' }}>
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
    </TimelineHeadWrapper>
  );
}

export const TimelineHeadPoint = forwardRef<HTMLDivElement, TimelineHeadProps>((props, ref) => {
  const { label, selectedDay, ...rest } = props;

  return (
    <TimelineHeadBase selectedDay={selectedDay} xPosOffset={40} zIndex={1301} {...rest}>
      <TimelinePlayheadWithAfter ref={ref}>
        <TimelinePlayheadContent>
          <TimelinePlayheadLabel>{label}</TimelinePlayheadLabel>
          {format(selectedDay, 'MMM do, yyyy')}
        </TimelinePlayheadContent>
      </TimelinePlayheadWithAfter>
    </TimelineHeadBase>
  );
});

TimelineHeadPoint.displayName = 'TimelineHeadPoint';

export const TimelineHeadIn = forwardRef<HTMLDivElement, TimelineHeadProps>((props, ref) => {
  const { label, selectedDay, ...rest } = props;

  return (
    <TimelineHeadBase isStrokeDashed selectedDay={selectedDay} {...rest}>
      <TimelinePlayheadLeft ref={ref}>
        <TimelinePlayheadContent>
          <TimelinePlayheadLabel>{label}</TimelinePlayheadLabel>
          {format(selectedDay, 'MMM do, yyyy')}
        </TimelinePlayheadContent>
      </TimelinePlayheadLeft>
    </TimelineHeadBase>
  );
});

TimelineHeadIn.displayName = 'TimelineHeadIn';

export const TimelineHeadOut = forwardRef<HTMLDivElement, TimelineHeadProps>((props, ref) => {
  const { label, selectedDay, ...rest } = props;

  return (
    <TimelineHeadBase isStrokeDashed selectedDay={selectedDay} xPosOffset={-15} {...rest}>
      <TimelinePlayheadRight ref={ref}>
        <TimelinePlayheadContent>
          <TimelinePlayheadLabel>{label}</TimelinePlayheadLabel>
          {format(selectedDay, 'MMM do, yyyy')}
        </TimelinePlayheadContent>
      </TimelinePlayheadRight>
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
