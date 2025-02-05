import format from 'date-fns/format';
import React from "react";
import { CollecticonChevronDownSmall } from "@devseed-ui/collecticons";
import { glsp, themeVal } from "@devseed-ui/theme-provider";
import styled from "styled-components";
import { View } from 'react-calendar/dist/cjs/shared/types';
import { SimpleDatePicker } from "$components/common/datepicker";
import { TipButton } from "$components/common/tip-button";

const DatePickerTrigger = styled(TipButton)`
  gap: ${glsp(0.5)};

  .head-reference {
    font-weight: ${themeVal('type.base.regular')};
    color: ${themeVal('color.base-400')};
    font-size: 0.875rem;
  }
`;

interface TimelineDatePickerProps {
    triggerHeadReference: string;
    selectedDay: Date | null;
    onConfirm: (date: Date | null) => void;
    disabled: boolean;
    triggerLabelFormat: string;
    tipContent?: string;
    dataTourId?: string;
    calendarView?: View | undefined;
    minDate?: Date | undefined;
    maxDate?: Date | undefined;
}

export const TimelineDatePicker = ({
    triggerHeadReference,
    selectedDay,
    onConfirm,
    disabled = false,
    tipContent,
    dataTourId,
    calendarView = 'month',
    triggerLabelFormat,
    minDate,
    maxDate,
  }: TimelineDatePickerProps) => {
    return (
    <SimpleDatePicker
      calendarView={calendarView}
      triggerHeadReference={triggerHeadReference}
      selectedDay={selectedDay}
      onConfirm={onConfirm}
      disabled={disabled}
      tipContent={tipContent}
      minDate={minDate}
      maxDate={maxDate}
      renderTriggerElement={({ onClick, disabled, tipContent, triggerHeadReference, selectedDay }) => (
        <DatePickerTrigger
          size='small'
          disabled={disabled}
          data-tour={dataTourId}
          tipContent={tipContent}
          onClick={onClick}
        >
          <span className='head-reference'>{triggerHeadReference}</span>
          <span>{format(selectedDay ?? new Date(), (triggerLabelFormat))}</span>
          <CollecticonChevronDownSmall />
        </DatePickerTrigger>
      )}
    />
  );};