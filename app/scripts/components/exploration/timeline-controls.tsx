import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ScaleTime } from 'd3';

import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { CollecticonChevronDownSmall } from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';
import { DatePicker } from '@devseed-ui/date-picker';

import { DateAxis } from './date-axis';
import { DateRange, emptyDateRange } from './constants';

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
  padding: ${glsp(1.5, 0.5, 0.5, 0.5)};
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
  selectedDay: Date | null;
  selectedInterval: DateRange | null;
  xScaled: ScaleTime<number, number>;
  width: number;
  onDayChange: (d: Date) => void;
  onIntervalChange: (d: DateRange) => void;
}

export function TimelineControls(props: TimelineControlsProps) {
  const {
    selectedDay,
    selectedInterval,
    xScaled,
    width,
    onDayChange,
    onIntervalChange
  } = props;

  return (
    <TimelineControlsSelf>
      <ControlsToolbar>
        <DatePicker
          id='date-picker-p'
          value={{ start: selectedDay, end: selectedDay }}
          onConfirm={(d) => {
            onDayChange(d.start!);
          }}
          renderTriggerElement={(props, label) => (
            <DatePickerButton {...props} size='small'>
              <span className='head-reference'>P</span>
              <span>{label}</span>
              <CollecticonChevronDownSmall />
            </DatePickerButton>
          )}
        />
        <DatePicker
          id='date-picker-lr'
          value={selectedInterval ?? emptyDateRange}
          onConfirm={(d) => {
            onIntervalChange({
              start: d.start!,
              end: d.end!
            });
          }}
          isClearable={false}
          isRange
          alignment='right'
          renderTriggerElement={(props) => (
            <DatePickerButton {...props} size='small'>
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
      </ControlsToolbar>

      <DateAxis xScaled={xScaled} width={width} />
    </TimelineControlsSelf>
  );
}
