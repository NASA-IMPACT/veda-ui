import React from 'react';

export const sterlizeNumber = (number, digitCount) => {
  const fixedNum = Number(number).toFixed(digitCount.current);
  return fixedNum;
};

export const textInputClasses =
  'flex-1 radius-md height-3 font-size-3xs width-7 border-2px tooltip';
export const thumbPosition = `position-absolute pointer-events width-card height-0 outline-0`;
export const tooltiptextClasses =
  'text-no-wrap text-white text-center radius-lg padding-x-105 padding-y-05 position-absolute z-1 bottom-205';
export const calculateStep = (max, min, digitCount) => {
  const numericDistance = max - min;
  if (numericDistance >= 100) {
    return 0.001;
  } else {
    let decimalPoints;
    if (numericDistance.toString().includes('.')) {
      decimalPoints = numericDistance.toString().split('.')[1].length || 0;
    } else {
      decimalPoints = numericDistance.toString().length || 0;
    }
    digitCount.current = decimalPoints + 2;

    //adding a default buffer for granular control
    return Math.pow(10, (decimalPoints + 2) * -1);
  }
};

//Calculate the range

export const rangeCalculation = (maxPercent, minPercent, range) => {
  const thumbWidth = 20;
  if (range.current) {
    range.current.style.width = `calc(${
      maxPercent - minPercent >= 100 ? 100 : maxPercent - minPercent
    }% - ${(thumbWidth - minPercent * 0.2) * (maxPercent / 100)}px )`;
  }
  return;
};

export const displayErrorMessage = (
  inputError,
  min,
  max,
  maxValRef,
  minValRef
) => {
  // error message for min input that is outside min max of color map

  if (inputError.max || inputError.min) {
    return (
      <p className='text-secondary-vivid'>
        Please enter a value between {min} and {max}
      </p>
    );
  }
  {
    /* error message for max input that is less than current min */
  }

  if (inputError.largerThanMax) {
    return (
      <p className='text-secondary-vivid'>
        Please enter a value less than {maxValRef.current.actual}
      </p>
    );
  }
  {
    /* error message for min input that is larger than current max */
  }

  if (inputError.lessThanMin) {
    return (
      <p className='text-secondary-vivid'>
        Please enter a value larger than {minValRef.current.actual}
      </p>
    );
  }
};
