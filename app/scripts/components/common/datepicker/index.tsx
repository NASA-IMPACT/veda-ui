import React, { ReactNode, useRef, useState, ReactElement } from "react";
import { DatePicker } from "@trussworks/react-uswds";
import moment from 'moment';

import './index.scss';

interface SimpleDatePickerProps {
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

export const SimpleDatePicker = ({ disabled, tipContent, onConfirm, id, triggerHeadReference, selectedDay, renderTriggerElement }: SimpleDatePickerProps) => {
    const [showCalendar, setShowCalendar] = useState(true);
    const datePickerRef = useRef<HTMLDivElement>(null);

    const toggleCalendar = () => {
      // We have no reference to the internals of the react-uswds DatePicker, so we have to query for it's trigger.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (datePickerRef.current) {
        const button = datePickerRef.current.querySelector('button.usa-date-picker__button')! as HTMLButtonElement;
        button.click();
      }
      setShowCalendar(!showCalendar);
    };

    return (
      <>
        {renderTriggerElement({
          onClick: () => {},
          disabled,
          tipContent,
          triggerHeadReference,
          selectedDay,
        })}
        <div ref={datePickerRef}>
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
