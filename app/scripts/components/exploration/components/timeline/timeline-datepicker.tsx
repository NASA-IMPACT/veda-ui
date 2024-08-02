import { format } from 'date-fns';
import React from "react";
import { CollecticonChevronDownSmall } from "@devseed-ui/collecticons";
import { glsp, themeVal } from "@devseed-ui/theme-provider";
import styled from "styled-components";
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
    tipContent?: string;
    dataTourId?: string;
    view?: 'month' | 'year' | 'decade' | 'century';
  }


const getLabel = (timeDensity) => {
  switch (timeDensity) {
    case 'day':
      return 'MMM do, yyyy';
    case 'month':
      return 'MMMM, yyyy';
    case 'year':
      return 'yyyy';
    default:
      return 'MMM do, yyyy';
  }
};

export const TimelineDatePicker = ({
    triggerHeadReference,
    selectedDay,
    onConfirm,
    disabled = false,
    tipContent,
    dataTourId,
    view = 'month'
  }: TimelineDatePickerProps) => {
    console.log(view);
    console.log('label ', getLabel(view));

    return (
    <SimpleDatePicker
      view={view}
      triggerHeadReference={triggerHeadReference}
      selectedDay={selectedDay}
      onConfirm={onConfirm}
      disabled={disabled}
      tipContent={tipContent}
      renderTriggerElement={({ onClick, disabled, tipContent, triggerHeadReference, selectedDay }) => (
        <DatePickerTrigger
          size='small'
          disabled={disabled}
          data-tour={dataTourId}
          tipContent={tipContent}
          onClick={onClick}
        >
          <span className='head-reference'>{triggerHeadReference}</span>
          <span>{format(selectedDay ?? new Date(), (getLabel(view)))}</span>
          <CollecticonChevronDownSmall />
        </DatePickerTrigger>
      )}
    />
  );};