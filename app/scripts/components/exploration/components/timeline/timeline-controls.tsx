import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useAtom, useAtomValue } from 'jotai';
import { endOfYear, format, startOfYear } from 'date-fns';
import { scaleTime, ScaleTime } from 'd3';

import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonChevronDownSmall,
  CollecticonPlusSmall,
  CollecticonResizeIn,
  CollecticonResizeOut,
  CollecticonTrashBin
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

import {
  analysisControllerAtom,
  isExpandedAtom,
  selectedCompareDateAtom,
  selectedDateAtom,
  selectedIntervalAtom
} from '$components/exploration/atoms/atoms';

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
  const [selectedCompareDay, setSelectedCompareDay] = useAtom(
    selectedCompareDateAtom
  );
  const [selectedInterval, setSelectedInterval] = useAtom(selectedIntervalAtom);
  const { isAnalyzing } = useAtomValue(analysisControllerAtom);
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
          <ToolbarGroup>
            <DatePicker
              id='date-picker-a'
              value={{ start: selectedDay, end: selectedDay }}
              onConfirm={(d) => {
                setSelectedDay(d.start!);
              }}
              renderTriggerElement={(props, label) => (
                <DatePickerButton {...props} size='small' disabled={!xScaled}>
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
                    >
                      <span className='head-reference'>B</span>
                      <span>{label}</span>
                      <CollecticonChevronDownSmall />
                    </DatePickerButton>
                  )}
                />
                <ToolbarIconButton
                  size='small'
                  onClick={() => {
                    setSelectedCompareDay(null);
                  }}
                >
                  <CollecticonTrashBin
                    meaningful
                    title='Stop comparing dates'
                  />
                </ToolbarIconButton>
              </>
            ) : (
              <ToolbarIconButton
                size='small'
                onClick={() => {
                  setSelectedCompareDay(selectedDay);
                }}
              >
                <CollecticonPlusSmall meaningful title='Add comparison date' />
              </ToolbarIconButton>
            )}
          </ToolbarGroup>
          <ToolbarGroup>
            {selectedInterval && (
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
                  <DatePickerButton {...props} size='small' disabled={!xScaled}>
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
            )}
            <VerticalDivider />

            <ToolbarIconButton
              disabled={!isAnalyzing}
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
          </ToolbarGroup>
        </Toolbar>
      </ControlsToolbar>

      <DateAxis xScaled={xScaled ?? initialScale} width={width} />
    </TimelineControlsSelf>
  );
}
