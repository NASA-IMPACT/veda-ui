import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { endOfYear, format, startOfYear } from 'date-fns';
import { scaleTime, ScaleTime } from 'd3';

import { glsp } from '@devseed-ui/theme-provider';
import { Toolbar, ToolbarGroup, VerticalDivider } from '@devseed-ui/toolbar';

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
}


export function getInitialScale(width) {
  const now = new Date();
  return scaleTime()
    .domain([startOfYear(now), endOfYear(now)])
    .range([0, width]);
}

export function TimelineDateAxis(props: Omit<TimelineControlsProps, "onZoom">) {
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

const TimelinePlayheadBase = styled.div`
  background-color: ${TIMELINE_PLAYHEAD_COLOR_PRIMARY};
  color: ${TIMELINE_PLAYHEAD_COLOR_TEXT};
  padding: 3px;
  border-radius: 4px;
  font-size: 0.75rem;
  position: relative;
  width: max-content;
  font-weight: 500;

  &::after, &::before {
    content: '';
    position: absolute;
    bottom: 3px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }
`;

const TimelinePlayheadLeftIndicator = styled(TimelinePlayheadBase)`
  background-color: ${TIMELINE_PLAYHEAD_COLOR_SECONDARY};

  &::after {
    left: -7px;
    border-right: 7px solid ${TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  }
`;

const TimelinePlayheadLeftIndicatorSecondary = styled(TimelinePlayheadBase)`
  &::after {
    left: -7px;
    border-right: 7px solid ${TIMELINE_PLAYHEAD_COLOR_PRIMARY};
  }
`;

const TimelinePlayheadRightIndicator = styled(TimelinePlayheadBase)`
  background-color: ${TIMELINE_PLAYHEAD_COLOR_SECONDARY};

  &::before {
    right: -6px;
    border-left: 7px solid ${TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  }
`;

const TimelinePlayheadRightIndicatorSecondary = styled(TimelinePlayheadBase)`
  &::before {
    right: -7px;
    border-left: 7px solid ${TIMELINE_PLAYHEAD_COLOR_PRIMARY};
  }
`;

const TimelineHeadRightIndicators = styled.div`
  position: absolute;
  bottom: 0;
  right: 120px;
  display: flex;
  flex-direction: row-reverse;
  gap: 10px;
`;


const TimelineHeadLeftIndicators = styled.div`
  position: absolute;
  bottom: 0;
  left: -8px;
  display: flex;
  gap: 10px;
`;

const getIndicators = (outOfViewHeads: TimelineHead[]) => {
  // Filter the out-of-view heads to get those that are out to the left
  const leftHeads = outOfViewHeads.filter(head => head.outDirection === 'left');
  // Filter the out-of-view heads to get those that are out to the right
  const rightHeads = outOfViewHeads.filter(head => head.outDirection === 'right');

  const formatDate = (date: Date | null) => (date ? format(date, 'MMM do, yyyy') : 'Invalid date');

  return (
    <>
      {/* If there are any heads out to the left, render the left indicators */}
      {leftHeads.length > 0 && (
        <TimelineHeadLeftIndicators>
          {/* Primary left indicator displaying the date of the first out-of-view head on the left */}
          <TimelinePlayheadLeftIndicator>
            <span>{formatDate(leftHeads[0].date)}</span>
          </TimelinePlayheadLeftIndicator>
          {/* Secondary left indicator(s) displaying the count of additional out-of-view heads on the left */}
          {leftHeads.length > 1 &&
            <TimelinePlayheadLeftIndicatorSecondary>
              +{leftHeads.length - 1}
            </TimelinePlayheadLeftIndicatorSecondary>}
        </TimelineHeadLeftIndicators>
      )}
      {/* If there are any heads out to the right, render the right indicators */}
      {rightHeads.length > 0 && (
        <TimelineHeadRightIndicators>
          {/* Primary right indicator displaying the date of the last out-of-view head on the right */}
          <TimelinePlayheadRightIndicator>
            <span>{formatDate(rightHeads[rightHeads.length - 1].date)}</span>
          </TimelinePlayheadRightIndicator>
          {/* Secondary right indicator displaying the count of additional out-of-view heads on the right */}
          {rightHeads.length > 1 &&
            <TimelinePlayheadRightIndicatorSecondary>
              +{rightHeads.length - 1}
            </TimelinePlayheadRightIndicatorSecondary>}
        </TimelineHeadRightIndicators>
      )}
    </>
  );
};

export function TimelineControls(props: TimelineControlsProps) {
  const { xScaled, width, outOfViewHeads, onZoom } = props;

  const [selectedDay, setSelectedDay] = useAtom(selectedDateAtom);
  const [selectedCompareDay, setSelectedCompareDay] = useAtom(
    selectedCompareDateAtom
  );
  const [selectedInterval, setSelectedInterval] = useAtom(selectedIntervalAtom);
  const { features } = useAois();

  // Scale to use when there are no datasets with data (loading or error)
  const initialScale = useMemo(() => getInitialScale(width) ,[width]);

  return (
    <TimelineControlsSelf>
        <ControlsToolbar>
        {outOfViewHeads?.length &&
          <TimelineHeadIndicatorsWrapper>
            {getIndicators(outOfViewHeads)}
          </TimelineHeadIndicatorsWrapper>}
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
