import React, { ReactNode, useState } from "react";
import { Icon } from "@trussworks/react-uswds";
import Calendar from 'react-calendar';
import Tippy from "@tippyjs/react";

import 'react-calendar/dist/Calendar.css';
import './index.scss';

interface SimpleDatePickerProps {
  disabled: boolean;
  tipContent: ReactNode;
  onConfirm: (date: Date | null) => void;
  triggerHeadReference: string;
  selectedDay: Date | null;
  renderTriggerElement: (props: {
    onClick: () => void;
    disabled: boolean;
    tipContent: ReactNode;
    triggerHeadReference: string;
    selectedDay: Date | null;
  }) => ReactNode;
}

export const SimpleDatePicker = ({
  disabled,
  tipContent,
  onConfirm,
  triggerHeadReference,
  selectedDay,
  renderTriggerElement
}: SimpleDatePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateChange = (date: Date) => {
    onConfirm(date);
    setIsCalendarOpen(false);
  };

  const handleTriggerClick = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  return (
    <>
      {renderTriggerElement({
        onClick: handleTriggerClick,
        disabled,
        tipContent,
        triggerHeadReference,
        selectedDay,
      })}
      {isCalendarOpen && (
        <Tippy
          className='react-calendar__tippy'
          visible={isCalendarOpen}
          onClickOutside={() => setIsCalendarOpen(false)}
          interactive={true}
          placement='bottom'
          content={
            <Calendar
              onChange={handleDateChange}
              value={selectedDay}
              className='react-calendar'
              maxDetail='month'
              nextLabel={<Icon.NavigateNext />}
              prevLabel={<Icon.NavigateBefore />}
              prev2Label={<Icon.NavigateFarBefore />}
              next2Label={<Icon.NavigateFarNext />}
            />
          }
        >
          <div />
        </Tippy>
      )}
    </>
  );
};
