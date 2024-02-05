import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';
import { endOfYear, format, startOfYear } from 'date-fns';
import { scaleTime, ScaleTime } from 'd3';

import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonChevronDownSmall,
  CollecticonResizeIn,
  CollecticonResizeOut
} from '@devseed-ui/collecticons';
import { DatePicker } from '@devseed-ui/date-picker';
import { Toolbar, ToolbarGroup, VerticalDivider } from '@devseed-ui/toolbar';

import { DateAxis } from './date-axis';
import { TimelineZoomControls } from './timeline-zoom-controls';
import { isExpandedAtom } from '$components/exploration/atoms/timeline';
import {
  selectedCompareDateAtom,
  selectedDateAtom,
  selectedIntervalAtom
} from '$components/exploration/atoms/dates';
import { DAY_SIZE_MAX } from '$components/exploration/constants';
import { CollecticonCalendarMinus } from '$components/common/icons/calendar-minus';
import { CollecticonCalendarPlus } from '$components/common/icons/calendar-plus';
import { TipButton, TipToolbarIconButton } from '$components/common/tip-button';
import { useAnalysisController } from '$components/exploration/hooks/use-analysis-data-request';
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
  padding: ${glsp(1.5, 1, 0.5, 1)};

  ${ToolbarGroup /* sc-selector */}:last-child:not(:first-child) {
    margin-left: auto;
  }
`;

const DatePickerButton = styled(TipButton)`
  gap: ${glsp(0.5)};

  .head-reference {
    font-weight: ${themeVal('type.base.regular')};
    color: ${themeVal('color.base-400')};
    font-size: 0.875rem;
  }
`;

const EmptyDateAxisWrapper = styled.div`
  padding-top: ${glsp(3)};
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
  const { isAnalyzing } = useAnalysisController();
  const [isExpanded, setExpanded] = useAtom(isExpandedAtom);
  const { features } = useAois();

  // Scale to use when there are no datasets with data (loading or error)
  const initialScale = useMemo(() => getInitialScale(width) ,[width]);

  return (
    <TimelineControlsSelf>
      <ControlsToolbar>
        <Toolbar>
          <ToolbarGroup>
            <DatePicker
              id='date-picker-a'
              value={{ start: selectedDay, end: selectedDay }}
              onConfirm={(d) => {
                setSelectedDay(d.start!);
              }}
              renderTriggerElement={(props, label) => (
                <DatePickerButton
                  {...props}
                  size='small'
                  disabled={!xScaled}
                  data-tour='date-picker-a'
                  tipContent={
                    selectedCompareDay
                      ? 'Date shown on left map '
                      : 'Date shown on map'
                  }
                >
                  <span className='head-reference'>A</span>
                  <span>{label}</span>
                  <CollecticonChevronDownSmall />
                </DatePickerButton>
              )}
            />
            <VerticalDivider />
            {selectedCompareDay ? (
              <>
                <DatePicker
                  id='date-picker-b'
                  value={{ start: selectedCompareDay, end: selectedCompareDay }}
                  onConfirm={(d) => {
                    setSelectedCompareDay(d.start!);
                  }}
                  renderTriggerElement={(props, label) => (
                    <DatePickerButton
                      {...props}
                      size='small'
                      disabled={!xScaled}
                      tipContent='Date shown on right map'
                    >
                      <span className='head-reference'>B</span>
                      <span>{label}</span>
                      <CollecticonChevronDownSmall />
                    </DatePickerButton>
                  )}
                />
                <TipToolbarIconButton
                  tipContent='Stop comparing dates'
                  size='small'
                  onClick={() => {
                    setSelectedCompareDay(null);
                  }}
                >
                  <CollecticonCalendarMinus
                    meaningful
                    title='Stop comparing dates'
                  />
                </TipToolbarIconButton>
              </>
            ) : (
              <TipToolbarIconButton
                visuallyDisabled={!!features.length}
                tipContent={
                  features.length
                    ? 'Compare is not possible when there are areas of interest on the map'
                    : 'Add date to compare'
                }
                size='small'
                data-tour='compare-date'
                onClick={() => {
                  if (!xScaled || !selectedDay) return;
                  const [, max] = xScaled.range();

                  // If we select a day using a fixed distance (like 2 days) the
                  // selected day will be close or far away depending on
                  // timeline zoom. Select using a pixel distance instead
                  const currentX = xScaled(selectedDay);
                  // We use DAY_SIZE_MAX as the pixel distance, so that at max
                  // zoom, we ensure that we do not select a date with less than
                  // 1 day of difference.
                  const nextX = currentX + DAY_SIZE_MAX;
                  // If date is outside the range, select the previous one.
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
              </TipToolbarIconButton>
            )}
          </ToolbarGroup>
          <ToolbarGroup>
            {selectedInterval ? (
              <>
                <DatePicker
                  id='date-picker-lr'
                  value={selectedInterval}
                  onConfirm={(d) => {
                    setSelectedInterval({
                      start: d.start!,
                      end: d.end!
                    });
                  }}
                  isClearable={false}
                  isRange
                  alignment='right'
                  renderTriggerElement={(props) => (
                    <DatePickerButton
                      {...props}
                      size='small'
                      disabled={!xScaled}
                      data-tour='analysis-toolbar'
                      tipContent='Date range for analysis'
                    >
                      <span className='head-reference'>From</span>
                      <span>
                        {format(selectedInterval.start, 'MMM do, yyyy')}
                      </span>
                      <span className='head-reference'>to</span>
                      <span>
                        {format(selectedInterval.end, 'MMM do, yyyy')}
                      </span>
                      <CollecticonChevronDownSmall />
                    </DatePickerButton>
                  )}
                />
                <VerticalDivider />

                <TimelineZoomControls onZoom={onZoom} />

                <VerticalDivider />

                <TipToolbarIconButton
                  tipContent={
                    isExpanded ? 'Hide chart y-axis' : 'Show chart y-axis'
                  }
                  visuallyDisabled={!isAnalyzing}
                  size='small'
                  onClick={() => {
                    setExpanded((v) => !v);
                  }}
                >
                  {isExpanded ? (
                    <CollecticonResizeIn
                      meaningful
                      title='Contract dataset rows'
                    />
                  ) : (
                    <CollecticonResizeOut
                      meaningful
                      title='Expand dataset rows'
                    />
                  )}
                </TipToolbarIconButton>
              </>
            ) : (
              <TimelineZoomControls onZoom={onZoom} />
            )}
          </ToolbarGroup>
        </Toolbar>
      </ControlsToolbar>

      <DateAxis xScaled={xScaled ?? initialScale} width={width} />
    </TimelineControlsSelf>
  );
}
