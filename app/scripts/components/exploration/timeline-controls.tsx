import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useAtom, useAtomValue } from 'jotai';
import { endOfYear, format, startOfYear } from 'date-fns';
import { scaleTime, ScaleTime } from 'd3';

import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonChevronDownSmall,
  CollecticonResizeIn,
  CollecticonResizeOut
} from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';
import { DatePicker } from '@devseed-ui/date-picker';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarIconButton,
  VerticalDivider
} from '@devseed-ui/toolbar';

import { DateAxis } from './date-axis';
import { emptyDateRange } from './constants';
import AnalysisMetricsDropdown from './analysis-metrics-dropdown';
import {
  activeAnalysisMetricsAtom,
  isAnalysisAtom,
  isExpandedAtom,
  selectedDateAtom,
  selectedIntervalAtom
} from './atoms';

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

  ${ToolbarGroup /* sc-selector */}:last-child {
    margin-left: auto;
  }
`;

const DatePickerButton = styled(Button)`
  gap: ${glsp(0.5)};

  .head-reference {
    font-weight: ${themeVal('type.base.regular')};
    color: ${themeVal('color.base-400')};
    font-size: 0.875rem;
  }
`;

interface TimelineControlsProps {
  xScaled?: ScaleTime<number, number>;
  width: number;
}

export function TimelineControls(props: TimelineControlsProps) {
  const { xScaled, width } = props;

  const [selectedDay, setSelectedDay] = useAtom(selectedDateAtom);
  const [selectedInterval, setSelectedInterval] = useAtom(selectedIntervalAtom);
  const [activeMetrics, setActiveMetrics] = useAtom(activeAnalysisMetricsAtom);
  const isAnalysis = useAtomValue(isAnalysisAtom);
  const [isExpanded, setExpanded] = useAtom(isExpandedAtom);

  // Scale to use when there are no datasets with data (loading or error)
  const initialScale = useMemo(() => {
    const now = new Date();
    return scaleTime()
      .domain([startOfYear(now), endOfYear(now)])
      .range([0, width]);
  }, [width]);

  return (
    <TimelineControlsSelf>
      <ControlsToolbar>
        <Toolbar>
          <DatePicker
            id='date-picker-p'
            value={{ start: selectedDay, end: selectedDay }}
            onConfirm={(d) => {
              setSelectedDay(d.start!);
            }}
            renderTriggerElement={(props, label) => (
              <DatePickerButton {...props} size='small' disabled={!xScaled}>
                <span className='head-reference'>P</span>
                <span>{label}</span>
                <CollecticonChevronDownSmall />
              </DatePickerButton>
            )}
          />
          <ToolbarGroup>
            <DatePicker
              id='date-picker-lr'
              value={selectedInterval ?? emptyDateRange}
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
                <DatePickerButton {...props} size='small' disabled={!xScaled}>
                  <span className='head-reference'>L</span>
                  <span>
                    {selectedInterval
                      ? format(selectedInterval.start, 'MMM do, yyyy')
                      : 'Date'}
                  </span>
                  <span className='head-reference'>R</span>
                  <span>
                    {selectedInterval
                      ? format(selectedInterval.end, 'MMM do, yyyy')
                      : 'Date'}
                  </span>
                  <CollecticonChevronDownSmall />
                </DatePickerButton>
              )}
            />
            <VerticalDivider />

            <ToolbarIconButton
              disabled={!isAnalysis}
              size='small'
              onClick={() => {
                setExpanded((v) => !v);
              }}
            >
              {isExpanded ? (
                <CollecticonResizeIn meaningful title='Contract dataset rows' />
              ) : (
                <CollecticonResizeOut meaningful title='Expand dataset rows' />
              )}
            </ToolbarIconButton>

            <AnalysisMetricsDropdown
              activeMetrics={activeMetrics}
              onMetricsChange={setActiveMetrics}
              isDisabled={!isAnalysis}
            />
          </ToolbarGroup>
        </Toolbar>
      </ControlsToolbar>

      <DateAxis xScaled={xScaled ?? initialScale} width={width} />
    </TimelineControlsSelf>
  );
}
