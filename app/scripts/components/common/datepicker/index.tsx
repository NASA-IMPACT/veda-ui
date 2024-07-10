import React, { ReactNode, useRef, useState, ReactElement } from "react";
import { DatePicker } from "@trussworks/react-uswds";
import moment from 'moment';

import './index.scss';

interface CustomDatePickerProps {
  disabled: boolean;
  tipContent: ReactNode;
  onConfirm: (date: string) => void;
  triggerHeadReference: string;
  id: string;
  selectedDay: Date | null;
  renderTriggerElement: (props: {
    onClick: () => void;
    disabled: boolean;
    tipContent: ReactNode;
    triggerHeadReference: string;
    selectedDay: Date | null;
  }) => ReactElement;
}

export const CustomDatePicker = ({ disabled, tipContent, onConfirm, id, triggerHeadReference, selectedDay, renderTriggerElement }: CustomDatePickerProps) => {
    const [showCalendar, setShowCalendar] = useState(true);
    const datePickerRef = useRef(null);

    const handleButtonClick = () => {
      if (datePickerRef.current) {
        datePickerRef.current.querySelector('button.usa-date-picker__button').click();
      }
      setShowCalendar(!showCalendar);
    };

    return (
      <>
        {renderTriggerElement({
          onClick: handleButtonClick,
          disabled,
          tipContent,
          triggerHeadReference,
          selectedDay,
        })}
        <div className="bg-primary-darker" ref={datePickerRef}>
          <DatePicker
            key={selectedDay ? selectedDay.toISOString() : 'default'}
            aria-describedby='veda-date-hint'
            aria-labelledby='veda-date-label'
            id={id}
            name={id}
            onChange={onConfirm}
            defaultValue={moment(selectedDay ?? new Date()).format('YYYY-MM-DD')}
          />
        </div>
      </>
    );
  };
