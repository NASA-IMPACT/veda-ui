import moment from "moment";
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
    id: string;
    triggerHeadReference: string;
    selectedDay: Date | null;
    onConfirm: (date: string) => void;
    disabled: boolean;
    tipContent?: string;
    dataTour?: string;
  }

export const TimelineDatePicker = ({
    id,
    triggerHeadReference,
    selectedDay,
    onConfirm,
    disabled = false,
    tipContent,
    dataTour
  }: TimelineDatePickerProps) => (
    <SimpleDatePicker
      id={id}
      triggerHeadReference={triggerHeadReference}
      selectedDay={selectedDay}
      onConfirm={onConfirm}
      disabled={disabled}
      tipContent={tipContent}
      renderTriggerElement={({ onClick, disabled, tipContent, triggerHeadReference, selectedDay }) => (
        <DatePickerTrigger
          size='small'
          disabled={disabled}
          data-tour={dataTour}
          tipContent={tipContent}
          onClick={onClick}
        >
          <span className='head-reference'>{triggerHeadReference}</span>
          <span>{moment(selectedDay ?? new Date()).format('MMM Do, YYYY')}</span>
          <CollecticonChevronDownSmall />
        </DatePickerTrigger>
      )}
    />
  );