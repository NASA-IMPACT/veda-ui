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
  outOfViewHeads?: any[];
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

const TimelineHeadIndicatorsWrapper = styled.div`
  position: absolute;
  bottom: -30px;
  width: 100%;
`;

const TimelinePlayead = styled.div`
  background-color: #8b8b8b;
  color: white;
  padding: 0 4px;
  border-radius: 4px;
  font-size: 0.75rem;
  position: relative;
  width: max-content;
  font-weight: 500;

  &::after {
    content: '';
    position: absolute;
    bottom: 5px;
    left: -2px;
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-right: 3px solid black;
  }
`;

const TimelinePlayheadLeftIndicator = styled(TimelinePlayead)`
  background-color: black;

  &:after {
    content: '';
    position: absolute;
    bottom: 1px;
    left: -6px;
    width: 0px;
    height: 0px;
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
    border-right: 7px solid black;
  }
`;

const TimelinePlayheadLeftIndicatorSecondary = styled(TimelinePlayheadLeftIndicator)`
  background-color: #8b8b8b;

  &:after {
    content: '';
    position: absolute;
    bottom: 1px;
    left: -6px;
    width: 0px;
    height: 0px;
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
    border-right: 7px solid #8b8b8b;
  }
`;

const TimelinePlayheadRightIndicator = styled(TimelinePlayead)`
  background-color: black;

  &:after {
    display: none;
  }

  &:before {
      content: '';
      position: absolute;
      bottom: 1px;
      right: -6px;
      width: 0px;
      height: 0px;
      border-top: 9px solid transparent;
      border-bottom: 9px solid transparent;
      border-left: 7px solid black;
      border-right: none;
  }
`;

const TimelinePlayheadRightIndicatorSecondary = styled(TimelinePlayheadRightIndicator)`
  background-color: #8b8b8b;

  &:after {
    display: none;
  }

  &:before {
      content: '';
      position: absolute;
      bottom: 1px;
      right: -6px;
      width: 0px;
      height: 0px;
      border-top: 9px solid transparent;
      border-bottom: 9px solid transparent;
      border-left: 7px solid #8b8b8b;
      border-right: none;
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

const getIndicators = (outOfViewHeads) => {
  const leftHeads = outOfViewHeads.filter(head => head.outDirection === 'left');
  const rightHeads = outOfViewHeads.filter(head => head.outDirection === 'right');

  return (
    <>
      {leftHeads.length > 0 && (
        <TimelineHeadLeftIndicators>
          <TimelinePlayheadLeftIndicator>
          <span>{format(leftHeads[0].date, 'MMM do, yyyy')}</span>
          </TimelinePlayheadLeftIndicator>
          {leftHeads.length > 1 &&
            <TimelinePlayheadLeftIndicatorSecondary>
              +{leftHeads.length - 1}
            </TimelinePlayheadLeftIndicatorSecondary>}
        </TimelineHeadLeftIndicators>
      )}
      {rightHeads.length > 0 && (
        <TimelineHeadRightIndicators>
          <TimelinePlayheadRightIndicator>
            <span>{format(rightHeads[rightHeads.length - 1].date, 'MMM do, yyyy')}</span>
          </TimelinePlayheadRightIndicator>
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
        <TimelineHeadIndicatorsWrapper>
          {getIndicators(outOfViewHeads)}
        </TimelineHeadIndicatorsWrapper>
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
