import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { endOfYear, startOfYear } from 'date-fns';
import { scaleTime, ScaleTime } from 'd3';

import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonChevronDownSmall
} from '@devseed-ui/collecticons';
import { Toolbar, ToolbarGroup, VerticalDivider } from '@devseed-ui/toolbar';

import moment from 'moment';
import { DateAxis } from './date-axis';
import { TimelineZoomControls } from './timeline-zoom-controls';
import {
  selectedCompareDateAtom,
  selectedDateAtom,
  selectedIntervalAtom
} from '$components/exploration/atoms/dates';
import { DAY_SIZE_MAX } from '$components/exploration/constants';
import { CollecticonCalendarMinus } from '$components/common/icons/calendar-minus';
import { CollecticonCalendarPlus } from '$components/common/icons/calendar-plus';
import { TipButton, TipToolbarIconButton } from '$components/common/tip-button';
import useAois from '$components/common/map/controls/hooks/use-aois';
import { CustomDatePicker } from '$components/common/datepicker';

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

  ${ToolbarGroup /* sc-selector */}:last-child:not(:first-child) {
    margin-left: auto;
  }
`;

const DatePickerTrigger = styled(TipButton)`
  gap: ${glsp(0.5)};

  .head-reference {
    font-weight: ${themeVal('type.base.regular')};
    color: ${themeVal('color.base-400')};
    font-size: 0.875rem;
  }
`;

const DatePickersWrapper = styled.div`
  display: flex;
  justify-content: center;
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

export function TimelineControls(props: TimelineControlsProps) {
  const { xScaled, width, onZoom } = props;

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
                <CustomDatePicker
                  id='date-picker-start'
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
                  renderTriggerElement={({ onClick, disabled, tipContent, triggerHeadReference, selectedDay }) => (
                    <DatePickerTrigger
                      size='small'
                      disabled={disabled}
                      data-tour='date-picker-start'
                      tipContent={tipContent}
                      onClick={onClick}
                    >
                      <span className='head-reference'>{triggerHeadReference}</span>
                      <span>{moment(selectedDay).format('MMM Do, YYYY')}</span>
                      <CollecticonChevronDownSmall />
                    </DatePickerTrigger>
                  )}
                />
                <VerticalDivider />
                <CustomDatePicker
                  id='date-picker-a'
                  triggerHeadReference={selectedCompareDay ? 'A:' : ''}
                  selectedDay={selectedDay}
                  onConfirm={(d) => {
                    if (!d) return;
                    setSelectedDay(new Date(d));
                  }}
                  disabled={!xScaled}
                  tipContent={selectedCompareDay
                    ? 'Date shown on left map '
                    : 'Date shown on map'}
                  renderTriggerElement={({ onClick, disabled, tipContent, triggerHeadReference, selectedDay }) => (
                    <DatePickerTrigger
                      size='small'
                      disabled={disabled}
                      data-tour='date-picker-a'
                      tipContent={tipContent}
                      onClick={onClick}
                    >
                      <span className='head-reference'>{triggerHeadReference}</span>
                      <span>{moment(selectedDay).format('MMM Do, YYYY')}</span>
                      <CollecticonChevronDownSmall />
                    </DatePickerTrigger>
                  )}
                />
                <VerticalDivider />
                <CustomDatePicker
                  id='date-picker-end'
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
                  renderTriggerElement={({ onClick, disabled, tipContent, triggerHeadReference, selectedDay }) => (
                    <DatePickerTrigger
                      size='small'
                      disabled={disabled}
                      data-tour='date-picker-end'
                      tipContent={tipContent}
                      onClick={onClick}
                    >
                      <span className='head-reference'>{triggerHeadReference}</span>
                      <span>{moment(selectedDay).format('MMM Do, YYYY')}</span>
                      <CollecticonChevronDownSmall />
                    </DatePickerTrigger>
                  )}
                />
                <VerticalDivider />
              </DatePickersWrapper>
            ) : (
              <>
                <DatePickersWrapper>
                <CustomDatePicker
                  id='date-picker-a'
                  triggerHeadReference={selectedCompareDay ? 'A:' : ''}
                  selectedDay={selectedDay}
                  onConfirm={(d) => {
                    if (!d) return;
                    setSelectedDay(new Date(d));
                  }}
                  disabled={!xScaled}
                  tipContent={selectedCompareDay
                    ? 'Date shown on left map '
                    : 'Date shown on map'}
                  renderTriggerElement={({ onClick, disabled, tipContent, triggerHeadReference, selectedDay }) => (
                    <DatePickerTrigger
                      size='small'
                      disabled={disabled}
                      data-tour='date-picker-a'
                      tipContent={tipContent}
                      onClick={onClick}
                    >
                      <span className='head-reference'>{triggerHeadReference}</span>
                      <span>{moment(selectedDay).format('MMM Do, YYYY')}</span>
                      <CollecticonChevronDownSmall />
                    </DatePickerTrigger>
                  )}
                />
                {selectedCompareDay && (
                  <>
                    <VerticalDivider />
                    <CustomDatePicker
                      id='date-picker-b'
                      triggerHeadReference='B:'
                      selectedDay={selectedCompareDay}
                      onConfirm={(d) => {
                        if (!d) return;
                        setSelectedCompareDay(new Date(d));
                      }}
                      disabled={!xScaled}
                      tipContent='Date shown on right map'
                      renderTriggerElement={({ onClick, disabled, tipContent, triggerHeadReference, selectedDay }) => (
                        <DatePickerTrigger
                          size='small'
                          disabled={disabled}
                          data-tour='date-picker-b'
                          tipContent={tipContent}
                          onClick={onClick}
                        >
                          <span className='head-reference'>{triggerHeadReference}</span>
                          <span>{moment(selectedDay).format('MMM Do, YYYY')}</span>
                          <CollecticonChevronDownSmall />
                        </DatePickerTrigger>
                      )}
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
