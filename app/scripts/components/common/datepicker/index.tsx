import React, { ReactNode, useRef, useState } from "react";
import { Icon } from "@trussworks/react-uswds";
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
  view?: 'month' | 'year' | 'decade' | 'century';
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

const getCalendarView = (timeDensity: 'day' | 'month' | 'year'): 'month' | 'year' | 'decade' | 'century' => {
  switch (timeDensity) {
    case 'day':
      return 'month';
    case 'month':
      return 'year';
    case 'year':
      return 'decade';
    default:
      return 'month';
  }
};

export const SimpleDatePicker = ({
  disabled,
  tipContent,
  onConfirm,
  triggerHeadReference,
  selectedDay,
  renderTriggerElement,
  view
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

  const calendarView = getCalendarView(view);

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
            />
          }
        >
          <div />
        </Tippy>
      )}
    </div>
  );
};
