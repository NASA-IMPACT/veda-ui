import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@trussworks/react-uswds';
import { Icon } from '@trussworks/react-uswds';
interface DateTimePickerProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
}
const DateTimePicker = (props: DateTimePickerProps) => {
  const { date, setDate } = props;

  if (!date) {
    return (
      <div className='display-flex flex-align-center'>
        <div
          className='bg-base-lighter border-2px border-base-light padding-y-05 padding-x-105 text-base-dark'
          style={{ minWidth: '120px', textAlign: 'center' }}
        >
          No date
        </div>
      </div>
    );
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year} ${month} ${day}`;

  const adjustDateByDays = (amount: number) => {
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate() + amount);
    setDate(newDate);
  };

  return (
    <div className='display-flex flex-align-center z-index-100 '>
      <Button
        type='button'
        unstyled
        className='margin-right-1 text-base-darker bg-white'
        onClick={(e) => {
          adjustDateByDays(1);
        }}
        aria-label='Go to previous day'
      >
        <Icon.ArrowBack size={3} />
      </Button>

      <div
        className='bg-white border-2px border-base-light padding-y-05 padding-x-105 text-bold text-base-darkest'
        style={{ minWidth: '120px', textAlign: 'center' }}
      >
        {formattedDate}
      </div>

      <Button
        type='button'
        unstyled
        className='margin-left-1 text-base-darker bg-white'
        onClick={(e) => {
          adjustDateByDays(1);
        }}
        aria-label='Go to next day'
      >
        <Icon.ArrowForward size={3} />
      </Button>
    </div>
  );
};
DateTimePicker.propTypes = {
  date: PropTypes.instanceOf(Date),
  setDate: PropTypes.func.isRequired
};

export default DateTimePicker;
