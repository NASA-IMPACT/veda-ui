import React, { forwardRef, useEffect, useRef } from 'react';
import styled, { css, useTheme } from 'styled-components';
import { drag, ScaleTime, select } from 'd3';
import clamp from 'date-fns/clamp';
import format from 'date-fns/format';
import startOfDay from 'date-fns/startOfDay';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { TIMELINE_PLAYHEAD_COLOR_LABEL, TIMELINE_PLAYHEAD_COLOR_PRIMARY, TIMELINE_PLAYHEAD_COLOR_SECONDARY, TIMELINE_PLAYHEAD_COLOR_TEXT } from './timeline-controls';
import { RIGHT_AXIS_SPACE } from '$components/exploration/constants';
import { DateRange } from '$components/exploration/types.d.ts';

// Needs padding so that the timeline head is fully visible.
// This value gets added to the width.
const SVG_PADDING = 16;
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

const TimelineHeadWrapper = styled.div`
  position: absolute;
  right: ${RIGHT_AXIS_SPACE - SVG_PADDING}px;
  top: -1rem;
  height: calc(100% + 1rem);
  pointer-events: none;
  z-index: ${themeVal('zIndices.overlay' as any)};
`;

const TimelinePlayheadWrapper = styled.div`
  position: absolute;

  &:hover {
    cursor: grab;
  }

  &.playhead-grab * {
    cursor: grabbing;
    background-color: ${TIMELINE_PLAYHEAD_COLOR_PRIMARY} !important;

    &::after {
      border-top: 8px solid ${TIMELINE_PLAYHEAD_COLOR_PRIMARY};
    }
  }
`;

const TimelinePlayheadBase = styled.div`
  background-color: ${TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  color: ${TIMELINE_PLAYHEAD_COLOR_TEXT};
  padding: ${glsp(0.15)} ${glsp(0.30)};
  border-radius: ${themeVal('shape.rounded')};
  font-size: 0.75rem;
  position: relative;
  box-shadow: 1px 1px 1px rgba(255, 255, 255, 0.3);
`;

const TimelinePlayheadExtended = styled(TimelinePlayheadBase)`
  background-color: ${TIMELINE_PLAYHEAD_COLOR_PRIMARY};
  border-top-left-radius: ${themeVal('shape.rounded')};
  border-top-right-radius: ${themeVal('shape.rounded')};
  min-width: 115px;
  text-align: center;
`;

const TimelinePlayhead = styled(TimelinePlayheadExtended)<{ direction: 'left' | 'right' }>`
  ${({ direction }) => direction === 'left'
    ? css`
      border-bottom-left-radius: ${themeVal('shape.rounded')};
      border-bottom-right-radius: 0;
      position: absolute;
      transform: translateX(-100%);
      left: ${glsp(1.05)};
    `
    : css`
      border-bottom-right-radius: ${themeVal('shape.rounded')};
      border-bottom-left-radius: 0;
      right: 0;
    `
  }
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
    border-top: 8px solid ${TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  }
`;

const TimelinePlayheadLabel = styled.span`
  color: ${TIMELINE_PLAYHEAD_COLOR_LABEL};
  margin-right: 5px;
`;

const TimelinePlayheadContent = styled.span`
  pointer-events: all;
  user-select: none;
  font-weight: ${themeVal('type.base.regular')};
  transform: translate(-14px, -4px);
  white-space: nowrap;
  position: relative;
  z-index: 1;
`;

const TimelineRangeTrackSelf = styled.div`
  position: absolute;
  top: 0;
  right: ${RIGHT_AXIS_SPACE}px;
  overflow: hidden;
  background: ${themeVal('color.base-100a')};
  height: 100%;

  .shaded {
    position: relative;
    background: ${TIMELINE_PLAYHEAD_COLOR_TEXT};
    height: 100%;
  }
`;

type TimelineHeadProps = Omit<TimelineHeadBaseProps, 'children'> & {
  label?: string;
  labelFormat: string;
};

export function TimelineHeadBase(props: TimelineHeadBaseProps) {
  const { domain, xScaled, selectedDay, width, onDayChange, xPosOffset = 0, zIndex = themeVal('zIndices.overlay'), isStrokeDashed, children } = props;

  const theme = useTheme();
  const rectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rectRef.current) return;

    const dragger = drag()
      .on('start', function dragstarted() {
        select(this).attr('cursor', 'grabbing');
        select(this).classed('playhead-grab', true);
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
        select(this).classed('playhead-grab', false);
      });

    select(rectRef.current).call(dragger);
  }, [width, domain, selectedDay, onDayChange, xScaled]);

  const xPos = xScaled(selectedDay);

  if (xPos < 0 || xPos > width) return null;

  return (
    <TimelineHeadWrapper style={{width: width + SVG_PADDING * 2, zIndex: zIndex as number}}>
      <TimelinePlayheadWrapper data-tour={props['data-tour']} ref={rectRef} style={{ transform: `translate(${xPos - xPosOffset}px, -12px)`}}>
        {children}
      </TimelinePlayheadWrapper>
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
  const { label, selectedDay, labelFormat, ...rest } = props;

  return (
    <TimelineHeadBase selectedDay={selectedDay} xPosOffset={40} zIndex={1301} {...rest}>
      <TimelinePlayheadWithAfter ref={ref}>
        <TimelinePlayheadContent>
          <TimelinePlayheadLabel>{label}</TimelinePlayheadLabel>
          {format(selectedDay, labelFormat)}
        </TimelinePlayheadContent>
      </TimelinePlayheadWithAfter>
    </TimelineHeadBase>
  );
});

TimelineHeadPoint.displayName = 'TimelineHeadPoint';

export const TimelineHeadIn = forwardRef<HTMLDivElement, TimelineHeadProps>((props, ref) => {
  const { label, selectedDay, labelFormat, ...rest } = props;

  return (
    <TimelineHeadBase isStrokeDashed selectedDay={selectedDay} {...rest}>
      <TimelinePlayhead direction='left' ref={ref}>
        <TimelinePlayheadContent>
          <TimelinePlayheadLabel>{label}</TimelinePlayheadLabel>
          {format(selectedDay, labelFormat)}
        </TimelinePlayheadContent>
      </TimelinePlayhead>
    </TimelineHeadBase>
  );
});

TimelineHeadIn.displayName = 'TimelineHeadIn';

export const TimelineHeadOut = forwardRef<HTMLDivElement, TimelineHeadProps>((props, ref) => {
  const { label, selectedDay, labelFormat, ...rest } = props;

  return (
    <TimelineHeadBase isStrokeDashed selectedDay={selectedDay} xPosOffset={-15} {...rest}>
      <TimelinePlayhead direction='right' ref={ref}>
        <TimelinePlayheadContent>
          <TimelinePlayheadLabel>{label}</TimelinePlayheadLabel>
          {format(selectedDay, labelFormat)}
        </TimelinePlayheadContent>
      </TimelinePlayhead>
    </TimelineHeadBase>
  );
});

TimelineHeadOut.displayName = 'TimelineHeadOut';

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
