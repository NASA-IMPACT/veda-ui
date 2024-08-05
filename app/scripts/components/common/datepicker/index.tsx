import React, { ReactNode, useRef, useState } from "react";
import { Icon } from "@trussworks/react-uswds";
import { View } from "react-calendar/dist/cjs/shared/types";
import Calendar from 'react-calendar';
import Tippy from "@tippyjs/react";
import styled from "styled-components";

import 'react-calendar/dist/Calendar.css';
import './index.scss';

interface SimpleDatePickerProps {
  disabled: boolean;
  tipContent: ReactNode;
  onConfirm: (date: Date | null) => void;
  triggerHeadReference: string;
  selectedDay: Date | null;
  calendarView?: View | undefined;
  renderTriggerElement: (props: {
    onClick: () => void;
    disabled: boolean;
    tipContent: ReactNode;
    triggerHeadReference: string;
    selectedDay: Date | null;
  }) => ReactNode;
}

const TriggerWrapper = styled.div`
  display: flex;
`;

export const SimpleDatePicker = ({
  disabled,
  tipContent,
  onConfirm,
  triggerHeadReference,
  selectedDay,
  renderTriggerElement,
  calendarView
}: SimpleDatePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (date: Date) => {
    onConfirm(date);
    setIsCalendarOpen(false);
  };

  const handleTriggerClick = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleClickOutside = (event) => {
    if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
      setIsCalendarOpen(false);
    }
  };

  return (
    <div>
      <TriggerWrapper ref={triggerRef}>
        {renderTriggerElement({
          onClick: handleTriggerClick,
          disabled,
          tipContent,
          triggerHeadReference,
          selectedDay,
        })}
      </TriggerWrapper>
      {isCalendarOpen && (
        <Tippy
          className='react-calendar__tippy'
          visible={isCalendarOpen}
          onClickOutside={(_, event) => handleClickOutside(event)}
          interactive={true}
          // Appending the Tippy container to the body instead of its default parent
          // (in this case it's the panel) to prevent the calendar from being cut off. The
          // panel has `overflow: hidden;` which is needed for the resizing. However, this
          // causes the calendar to be cut-off when it opens upwards, near the bottom of the screen.
          appendTo={() => document.body}
          placement='bottom'
          content={
            <Calendar
              onChange={handleDateChange}
              value={selectedDay}
              className='react-calendar'
              nextLabel={<Icon.NavigateNext />}
              prevLabel={<Icon.NavigateBefore />}
              prev2Label={<Icon.NavigateFarBefore />}
              next2Label={<Icon.NavigateFarNext />}
              defaultView={calendarView}
              maxDetail={calendarView}
            />
          }
        >
          <div />
        </Tippy>
      )}
    </div>
  );
};
