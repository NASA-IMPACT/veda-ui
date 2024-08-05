import React, { memo, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useAtom } from 'jotai';
import { endOfYear, startOfYear } from 'date-fns';
import { scaleTime, ScaleTime } from 'd3';

import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Toolbar, ToolbarGroup, VerticalDivider } from '@devseed-ui/toolbar';

import { isEqual } from 'lodash';
import { View } from 'react-calendar/dist/cjs/shared/types';
import {
  TimeDensity,
} from './../../types.d.ts';
import { DateAxis } from './date-axis';
import { TimelineZoomControls } from './timeline-zoom-controls';
import { TimelineDatePicker } from './timeline-datepicker';
import { TimelineHead } from './timeline';
import {
  selectedCompareDateAtom,
  selectedDateAtom,
  selectedIntervalAtom
} from '$components/exploration/atoms/dates';
import { DAY_SIZE_MAX } from '$components/exploration/constants';
import { CollecticonCalendarMinus } from '$components/common/icons/calendar-minus';
import { CollecticonCalendarPlus } from '$components/common/icons/calendar-plus';
import { TipToolbarIconButton } from '$components/common/tip-button';
import useAois from '$components/common/map/controls/hooks/use-aois';
import { formatDate } from '$components/exploration/data-utils';

const TimelineControlsSelf = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  min-width: 0;

  .date-axis {
    margin-top: auto;
  }
`;

const ControlsToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${glsp(1.5, 1, 0.5, 1)};
  position: relative;

  ${ToolbarGroup /* sc-selector */}:last-child:not(:first-child) {
    margin-left: auto;
  }
`;

const DatePickersWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const EmptyDateAxisWrapper = styled.div`
  padding-top: ${glsp(3)};
`;

const ToolbarFullWidth = styled(Toolbar)`
  width: 100%;
`;

interface TimelineControlsProps {
  xScaled?: ScaleTime<number, number>;
  width: number;
  outOfViewHeads?: TimelineHead[];
  onZoom: (zoom: number) => void;
  timeDensity: TimeDensity;
  timelineLabelsFormat: string;
}


export function getInitialScale(width) {
  const now = new Date();
  return scaleTime()
    .domain([startOfYear(now), endOfYear(now)])
    .range([0, width]);
}

export function TimelineDateAxis(props: Omit<TimelineControlsProps, "onZoom" | "timeDensity" | "timelineLabelsFormat">) {
  const { xScaled, width } = props;

  const initialScale = useMemo(() => {
    return getInitialScale(width);
  }, [width]);

  return (
    <TimelineControlsSelf>
      <EmptyDateAxisWrapper>
        <DateAxis xScaled={xScaled ?? initialScale} width={width} />
      </EmptyDateAxisWrapper>
    </TimelineControlsSelf>
  );
}

export const TIMELINE_PLAYHEAD_COLOR_PRIMARY = '#8b8b8b';
export const TIMELINE_PLAYHEAD_COLOR_SECONDARY = '#333333';
export const TIMELINE_PLAYHEAD_COLOR_TEXT = '#ffffff';
export const TIMELINE_PLAYHEAD_COLOR_LABEL = '#cccccc';

const TimelineHeadIndicatorsWrapper = styled.div`
  position: absolute;
  bottom: -30px;
  width: 100%;
`;

interface PlayheadProps {
  secondary?: boolean;
}

const TimelinePlayheadBase = styled.div<PlayheadProps>`
  background-color: ${TIMELINE_PLAYHEAD_COLOR_PRIMARY};
  color: ${TIMELINE_PLAYHEAD_COLOR_TEXT};
  padding: ${glsp(0.15)} ${glsp(0.30)};
  border-radius: ${themeVal('shape.rounded')};
  font-size: 0.75rem;
  position: relative;
  width: max-content;
  font-weight: ${themeVal('type.base.regular')};

  &::after, &::before {
    content: '';
    position: absolute;
    bottom: 1px;
    width: 0;
    height: 0;
    border-top: 11.5px solid transparent;
    border-bottom: 11.5px solid transparent;
  }
`;

const PlayheadArrow = css<PlayheadProps>`
  &::after, &::before {
    content: '';
    position: absolute;
    bottom: 1px;
    width: 0;
    height: 0;
    border-top: 11.5px solid transparent;
    border-bottom: 11.5px solid transparent;
  }
`;

const LeftPlayheadArrow = css<PlayheadProps>`
  ${PlayheadArrow}
  &::after {
    border-right: 8px solid ${props => props.secondary ? TIMELINE_PLAYHEAD_COLOR_PRIMARY : TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  }
`;

const RightPlayheadArrow = css<PlayheadProps>`
  ${PlayheadArrow}
  &::before {
    border-left: 8px solid ${props => props.secondary ? TIMELINE_PLAYHEAD_COLOR_PRIMARY : TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  }
`;

const TimelinePlayheadLeftIndicator = styled(TimelinePlayheadBase)`
  background-color: ${props => props.secondary ? TIMELINE_PLAYHEAD_COLOR_PRIMARY : TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  ${LeftPlayheadArrow}
  &::after {
    left: ${props => props.secondary ? '-28%' : '-8%'};
  }
`;

const TimelinePlayheadRightIndicator = styled(TimelinePlayheadBase)`
  background-color: ${props => props.secondary ? TIMELINE_PLAYHEAD_COLOR_PRIMARY : TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  ${RightPlayheadArrow}
  &::before {
    right: ${props => props.secondary ? '-28%' : '-8%'};
  }
`;

const TimelineHeadIndicatorsBase = styled.div`
  position: absolute;
  bottom: 1px;
  display: flex;
  gap: ${glsp(1)};
`;

const TimelineHeadLeftIndicators = styled(TimelineHeadIndicatorsBase)`
  left: 0;
`;

const TimelineHeadRightIndicators = styled(TimelineHeadIndicatorsBase)`
  right: 125px;
  flex-direction: row-reverse;
`;

export const TimelineHeadIndicators = memo(({ outOfViewHeads }: { outOfViewHeads: TimelineHead[] }) => {
  // Filter the out-of-view heads to get those that are out to the left
  const leftHeads = outOfViewHeads.filter(head => head.outDirection === 'left');
  // Filter the out-of-view heads to get those that are out to the right
  const rightHeads = outOfViewHeads.filter(head => head.outDirection === 'right');

  return (
    <>
      {/* If there are any heads out to the left, render the left indicators */}
      {leftHeads.length > 0 && (
        <TimelineHeadLeftIndicators>
        <TimelinePlayheadLeftIndicator>
          <span>{formatDate(leftHeads[0].date)}</span>
        </TimelinePlayheadLeftIndicator>
        {leftHeads.length > 1 &&
          <TimelinePlayheadLeftIndicator secondary>
            +{leftHeads.length - 1}
          </TimelinePlayheadLeftIndicator>}
        </TimelineHeadLeftIndicators>
      )}
      {/* If there are any heads out to the right, render the right indicators */}
      {rightHeads.length > 0 && (
       <TimelineHeadRightIndicators>
       <TimelinePlayheadRightIndicator>
         <span>{formatDate(rightHeads[rightHeads.length - 1].date)}</span>
       </TimelinePlayheadRightIndicator>
       {rightHeads.length > 1 &&
         <TimelinePlayheadRightIndicator secondary>
           +{rightHeads.length - 1}
         </TimelinePlayheadRightIndicator>}
       </TimelineHeadRightIndicators>
      )}
    </>
  );
}, (prevProps, nextProps) => {
  // React.memo does a shallow comparison of props, so we need to supply
  // a custom comparison function to compare the outOfViewHead objects
  return isEqual(prevProps.outOfViewHeads, nextProps.outOfViewHeads);
});

TimelineHeadIndicators.displayName = 'TimelineHeadIndicators';

/**
 * Determines the appropriate calendar view based on the time density.
 *
 * The TimeDensity enumeration is mapped to the corresponding calendar view:
 * - DAY: Displays the calendar in 'month' view, which shows all days of the month.
 * - YEAR: Displays the calendar in 'year' view, showing all months in a year.
 */
const getCalendarView = (timeDensity: TimeDensity): View | undefined => {
  switch (timeDensity) {
    case TimeDensity.MONTH:
      return 'month';
    case TimeDensity.YEAR:
      return 'year';
    default:
      return 'month';
  }
};

export function TimelineControls(props: TimelineControlsProps) {
  const { xScaled, width, outOfViewHeads, onZoom, timeDensity, timelineLabelsFormat } = props;

  const [selectedDay, setSelectedDay] = useAtom(selectedDateAtom);
  const [selectedCompareDay, setSelectedCompareDay] = useAtom(
    selectedCompareDateAtom
  );
  const [selectedInterval, setSelectedInterval] = useAtom(selectedIntervalAtom);
  const { features } = useAois();

  // Scale to use when there are no datasets with data (loading or error)
  const initialScale = useMemo(() => getInitialScale(width) ,[width]);

  const calendarView = useMemo(() => getCalendarView(timeDensity), [timeDensity]);

  return (
    <TimelineControlsSelf>
        <ControlsToolbar>
        {outOfViewHeads && outOfViewHeads.length > 0 && (
          <TimelineHeadIndicatorsWrapper>
            <TimelineHeadIndicators outOfViewHeads={outOfViewHeads} />
          </TimelineHeadIndicatorsWrapper>
        )}
        <ToolbarFullWidth>
          <ToolbarGroup>
            {!selectedInterval && (
              <>
                {!selectedCompareDay && (
                  <TipToolbarIconButton
                    visuallyDisabled={!!features.length}
                    tipContent={
                      features.length
                        ? 'Compare is not possible when there are areas of interest on the map'
                        : 'Add date to compare'
                    }
                    size='small'
                    variation='primary-text'
                    data-tour='compare-date'
                    onClick={() => {
                      if (!xScaled || !selectedDay) return;
                      const [, max] = xScaled.range();

                      const currentX = xScaled(selectedDay);
                      const nextX = currentX + DAY_SIZE_MAX;
                      const newDate = xScaled.invert(
                        nextX > max ? currentX - DAY_SIZE_MAX : nextX
                      );

                      setSelectedCompareDay(newDate);
                    }}
                  >
                    <CollecticonCalendarPlus
                      meaningful
                      title='Add comparison date'
                    />
                    Add date to compare
                  </TipToolbarIconButton>
                )}

                {selectedCompareDay && (
                  <TipToolbarIconButton
                    tipContent='Stop comparing dates'
                    size='small'
                    variation='primary-text'
                    onClick={() => {
                      setSelectedCompareDay(null);
                    }}
                  >
                    <CollecticonCalendarMinus
                      meaningful
                      title='Stop comparing dates'
                    />
                    Stop comparing dates
                  </TipToolbarIconButton>
                )}
              </>
            )}
            {selectedInterval ? (
              <DatePickersWrapper>
                <TimelineDatePicker
                  triggerHeadReference='FROM:'
                  selectedDay={selectedInterval.start}
                  onConfirm={(d) => {
                    if (!d) return;
                    setSelectedInterval({
                      ...selectedInterval,
                      start: new Date(d)
                    });
                  }}
                  disabled={!xScaled}
                  tipContent='Start date for analysis'
                  dataTourId='date-picker-start'
                  calendarView={calendarView}
                  triggerLabelFormat={timelineLabelsFormat}
                />
                <VerticalDivider />
                <TimelineDatePicker
                  triggerHeadReference={selectedCompareDay ? 'A:' : ''}
                  selectedDay={selectedDay}
                  onConfirm={(d) => {
                    if (!d) return;
                    setSelectedDay(new Date(d));
                  }}
                  disabled={!xScaled}
                  tipContent={selectedCompareDay ? 'Date shown on left map ' : 'Date shown on map'}
                  dataTourId='date-picker-a'
                  calendarView={calendarView}
                  triggerLabelFormat={timelineLabelsFormat}
                />
                <VerticalDivider />
                <TimelineDatePicker
                  triggerHeadReference='TO:'
                  selectedDay={selectedInterval.end}
                  onConfirm={(d) => {
                    if (!d) return;
                    setSelectedInterval({
                      ...selectedInterval,
                      end: new Date(d)
                    });
                  }}
                  disabled={!xScaled}
                  tipContent='End date for analysis'
                  dataTourId='date-picker-end'
                  calendarView={calendarView}
                  triggerLabelFormat={timelineLabelsFormat}
                />
              </DatePickersWrapper>
            ) : (
              <>
                <DatePickersWrapper>
                <TimelineDatePicker
                  triggerHeadReference={selectedCompareDay ? 'A:' : ''}
                  selectedDay={selectedDay}
                  onConfirm={(d) => {
                    if (!d) return;
                    setSelectedDay(new Date(d));
                  }}
                  disabled={!xScaled}
                  tipContent={selectedCompareDay ? 'Date shown on left map ' : 'Date shown on map'}
                  dataTourId='date-picker-a'
                  calendarView={calendarView}
                  triggerLabelFormat={timelineLabelsFormat}
                />
                {selectedCompareDay && (
                  <>
                    <VerticalDivider />
                    <TimelineDatePicker
                      triggerHeadReference='B:'
                      selectedDay={selectedCompareDay}
                      onConfirm={(d) => {
                        if (!d) return;
                        setSelectedCompareDay(new Date(d));
                      }}
                      disabled={!xScaled}
                      tipContent='Date shown on right map'
                      dataTourId='date-picker-b'
                      calendarView={calendarView}
                      triggerLabelFormat={timelineLabelsFormat}
                    />
                  </>
                )}
                </DatePickersWrapper>
              </>
            )}
            <TimelineZoomControls onZoom={onZoom} />
          </ToolbarGroup>
        </ToolbarFullWidth>
        </ControlsToolbar>

      <DateAxis xScaled={xScaled ?? initialScale} width={width} />
    </TimelineControlsSelf>
  );
}
