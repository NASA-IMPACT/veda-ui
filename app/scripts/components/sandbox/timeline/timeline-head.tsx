import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { drag, select } from 'd3';
import { clamp, startOfDay } from 'date-fns';
import { themeVal } from '@devseed-ui/theme-provider';

const TimelineHeadSVG = styled.svg`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  pointer-events: none;
  z-index: 2000;
`;

const dropShadowFilter =
  'drop-shadow(0px 2px 2px rgba(44, 62, 80, 0.08)) drop-shadow(0px 0px 4px rgba(44, 62, 80, 0.08))';

export function TimelineHead(props: any) {
  const { domain, xScaled, selectedDay, width, setSelectedDay, children } =
    props;

  const theme = useTheme();
  const rectRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    if (!rectRef.current) return;

    const dragger = drag()
      .on('start', function dragstarted() {
        document.body.style.cursor = 'grabbing';
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
          setSelectedDay(newDate);
        }
      })
      .on('end', function dragended() {
        document.body.style.cursor = '';
        select(this).attr('cursor', 'grab');
      });

    select(rectRef.current).call(dragger);
  }, [width, domain, selectedDay, setSelectedDay, xScaled]);

  return (
    <TimelineHeadSVG width={width}>
      <line
        x1={xScaled(selectedDay)}
        x2={xScaled(selectedDay)}
        y1={0}
        y2='100%'
        stroke={theme.color?.base}
      />
      {/* <rect
        ref={rectRef}
        fill='none'
        style={{ pointerEvents: 'all', cursor: 'grab' }}
        y={0}
        height={16}
        x={xScaled(selectedDay) - 8}
        width={16}
      /> */}
      <g transform={`translate(${xScaled(selectedDay)}, 0)`} ref={rectRef}>
        {children}
      </g>
    </TimelineHeadSVG>
  );
}

export function TimelineHeadP(props: any) {
  const theme = useTheme();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { children, ...rest } = props;

  return (
    <TimelineHead {...rest}>
      <path
        transform='translate(-14, -4)'
        d='M4 14.6459C4 15.4637 4.4979 16.1992 5.25722 16.5029L13.2572 19.7029C13.734 19.8936 14.266 19.8936 14.7428 19.7029L22.7428 16.5029C23.5021 16.1992 24 15.4637 24 14.6459L24 6C24 4.89543 23.1046 4 22 4L6 4C4.89543 4 4 4.89543 4 6L4 14.6459Z'
        fill={theme.color?.surface}
        stroke={theme.color?.['base-200']}
        style={{
          filter: dropShadowFilter,
          pointerEvents: 'all',
          cursor: 'grab'
        }}
      />
      <text fill={theme.color?.base} fontSize='0.75rem' y='0' x='-4' dy='1em'>
        P
      </text>
    </TimelineHead>
  );
}

export function TimelineHeadL(props: any) {
  const theme = useTheme();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { children, ...rest } = props;

  return (
    <TimelineHead {...rest}>
      <path
        transform='translate(-6, -4)'
        d='M4 6C4 4.89543 4.89543 4 6 4H15.1716C15.702 4 16.2107 4.21071 16.5858 4.58579L22.5858 10.5858C23.3668 11.3668 23.3668 12.6332 22.5858 13.4142L16.5858 19.4142C16.2107 19.7893 15.702 20 15.1716 20H6C4.89543 20 4 19.1046 4 18V6Z'
        fill={theme.color?.surface}
        stroke={theme.color?.['base-200']}
        style={{
          filter: dropShadowFilter,
          pointerEvents: 'all',
          cursor: 'grab'
        }}
      />
      <text fill={theme.color?.base} fontSize='0.75rem' y='0' x='2' dy='1em'>
        L
      </text>
    </TimelineHead>
  );
}

export function TimelineHeadR(props: any) {
  const theme = useTheme();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { children, ...rest } = props;

  return (
    <TimelineHead {...rest}>
      <path
        transform='translate(-22, -4)'
        d='M24 6C24 4.89543 23.1046 4 22 4H12.8284C12.298 4 11.7893 4.21071 11.4142 4.58579L5.41421 10.5858C4.63316 11.3668 4.63317 12.6332 5.41421 13.4142L11.4142 19.4142C11.7893 19.7893 12.298 20 12.8284 20H22C23.1046 20 24 19.1046 24 18V6Z'
        fill={theme.color?.surface}
        stroke={theme.color?.['base-200']}
        style={{
          filter: dropShadowFilter,
          pointerEvents: 'all',
          cursor: 'grab'
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
        R
      </text>
    </TimelineHead>
  );
}

const TimelineRangeTrackSelf = styled.div`
  position: absolute;
  right: 0;

  .shaded {
    position: absolute;
    background: ${themeVal('color.base-100')};
    height: 1rem;
  }
`;

export function TimelineRangeTrack(props: any) {
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
