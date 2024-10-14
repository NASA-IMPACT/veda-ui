import React, { useCallback, useEffect, useState, useRef } from 'react';

import './color-range-slider.scss';
import { colorMapScale } from '$components/exploration/types.d.ts';

import { USWDSTextInput } from '$components/common/uswds';

interface ColorrangeRangeSlideProps {
  // Absolute minimum of color range
  min: number;

  // Absolute maximum of color range
  max: number;

  // Previously selected minimum and maximum of colorRangeScale
  colorMapScale: colorMapScale | undefined;

  // Update colorRangeScale
  setColorMapScale: (colorMapScale: colorMapScale) => void;
}

export function ColorRangeSlider({
  min,
  max,
  colorMapScale,
  setColorMapScale
}: ColorrangeRangeSlideProps) {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const [inputError, setInputError] = useState({
    min: false,
    max: false,
    largerThanMax: false,
    lessThanMin: false
  });

  const minValRef = useRef<string | number>(
    colorMapScale?.min ? colorMapScale.min : min
  );
  const maxValRef = useRef<string | number>(
    colorMapScale?.max ? colorMapScale.max : max
  );
  const range = useRef(null);
  const middleMarker = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );
  const rangeCalculation = (maxPercent, minPercent) => {
    if (range.current) {
      range.current.style.width = `${
        maxPercent - minPercent >= 100 ? 100 : maxPercent - minPercent
      }%`;
    }
    if (middleMarker.current)
      middleMarker.current.style.left = `${range.current.style.width}%`;
    return;
  };

  // Set width of the range to decrease from the right side

  useEffect(() => {
    let maxValPrevious;
    let minValPrevious;

    if (Object.values(inputError).every((v) => v === false)) {
      if (
        colorMapScale &&
        maxVal != maxValPrevious &&
        minVal != minValPrevious
      ) {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxValRef.current);

        rangeCalculation(maxPercent, minPercent);

        if (range.current) range.current.style.left = `${minPercent}%`;
      } else {
        if (maxVal != maxValPrevious) {
          maxValPrevious = maxVal;
          const minPercent = getPercent(minValRef.current);
          const maxPercent = getPercent(maxVal);
          rangeCalculation(maxPercent, minPercent);
        }
        if (minVal != minValPrevious) {
          minValPrevious = minVal;
          const minPercent = getPercent(minVal);
          const maxPercent = getPercent(maxValRef.current);
          rangeCalculation(maxPercent, minPercent);
          if (range.current) range.current.style.left = `${minPercent}%`;
        }
      }
    }

    if (
      !colorMapScale ||
      (colorMapScale.max == max && colorMapScale.min == min)
    ) {
      setColorMapScale({ min: minVal, max: maxVal });
    } else
      setColorMapScale({
        min: Number(minValRef.current),
        max: Number(maxValRef.current)
      });
  }, [maxVal, minVal, getPercent, setColorMapScale, inputError]);

  const resetErrorOnSlide = (value, slider) => {
    if (value > min || value < max) {
      slider === 'max'
        ? setInputError({ ...inputError, max: false, lessThanMin: false })
        : setInputError({ ...inputError, min: false, largerThanMax: false });
    }
  };
  const textInputClasses =
    'flex-1 radius-md height-3 font-size-3xs width-5 border-2px ';
  const thumbPosition = `position-absolute pointer-events width-card height-0 outline-0`;
  return (
    <div className='border-bottom-1px padding-bottom-1 border-base-light width-full text-normal'>
      <form className='usa-form display-flex flex-row flex-justify flex-align-center padding-bottom-1'>
        <label className='font-ui-3xs text-gray-90 text-semibold margin-right-1 flex-1'>
          Rescale
        </label>

        <USWDSTextInput
          type='number'
          id='range slider min'
          name='min'
          placeholder={minValRef.current}
          className={`${textInputClasses} ${
            inputError.min || inputError.largerThanMax
              ? 'border-secondary-vivid text-secondary-vivid'
              : ' border-base-light'
          }`}
          value={minValRef.current}
          onChange={(event) => {
            minValRef.current = event.target.value;
            const value = Number(event.target.value);

            if (value > maxVal - 0.001)
              return setInputError({ ...inputError, largerThanMax: true });
            if (value < min || value > max) {
              return setInputError({ ...inputError, min: true });
            } else {
              setInputError({
                ...inputError,
                min: false,
                largerThanMax: false
              });
              setMinVal(Math.min(value, maxVal - 0.001));
            }
          }}
        />

        <div className='position-relative container display-flex flex-align-center flex-justify-center padding-x-2'>
          <input
            type='range'
            min={min}
            max={max}
            step='.001'
            value={minVal}
            onChange={(event) => {
              const value = Math.min(
                Number(event.target.value),
                maxVal - 0.001
              );
              resetErrorOnSlide(value, 'min');
              setMinVal(value);
              minValRef.current = value;
            }}
            className={`thumb ${thumbPosition} z-index-300`}
            style={{ zIndex: minVal >= max - 10 * 0.001 ? '500' : '300' }}
          />
          <input
            type='range'
            min={min}
            step='.001'
            max={max}
            value={maxVal}
            onChange={(event) => {
              const value = Math.max(
                Number(event.target.value),
                minVal + 0.001
              );
              resetErrorOnSlide(value, 'max');
              setMaxVal(value);
              maxValRef.current = value;
            }}
            className={`thumb ${thumbPosition} z-400`}
            style={{ zIndex: minVal <= max - 10 * 0.001 ? '500' : '400' }}
          />
          <div className='slider width-card position-relative height-3 display-flex flex-align-center'>
            <div className='slider__track radius-md position-absolute height-05 z-100 width-full display-flex flex-align-center' />
            <div
              ref={range}
              className='slider__range display-flex flex-align-center flex-justify-center radius-md position-absolute height-05 z-200'
            >
              {min < 0 ? (
                <div
                  ref={middleMarker}
                  className='position-relative height-2 width-1px middle_marker'
                />
              ) : null}
            </div>
          </div>
        </div>
        <USWDSTextInput
          type='number'
          data-validate-numerical='[0-9]*'
          id='range slider max'
          name='max'
          placeholder={maxValRef.current}
          className={`${textInputClasses} ${
            inputError.max || inputError.lessThanMin
              ? 'border-secondary-vivid text-secondary-vivid'
              : ' border-base-light'
          }`}
          value={maxValRef.current}
          onChange={(event) => {
            const value = Number(event.target.value);
            maxValRef.current = event.target.value;

            if (value < minVal + 0.001)
              return setInputError({ ...inputError, lessThanMin: true });

            if (value < min || value > max) {
              return setInputError({ ...inputError, max: true });
            } else {
              setInputError({ ...inputError, max: false, lessThanMin: false });
              setMaxVal(Math.max(value, minVal + 0.001));
              // maxValRef.current = event.target.value;
            }
          }}
        />
      </form>
      {inputError.max || inputError.min ? (
        <p className='text-secondary-vivid'>
          Please enter a value between {min} and {max}
        </p>
      ) : null}{' '}
      {inputError.largerThanMax ? (
        <p className='text-secondary-vivid'>
          Please enter a value less than {maxValRef.current}
        </p>
      ) : null}
      {inputError.lessThanMin ? (
        <p className='text-secondary-vivid'>
          Please enter a value larger than {minValRef.current}
        </p>
      ) : null}
    </div>
  );
}
