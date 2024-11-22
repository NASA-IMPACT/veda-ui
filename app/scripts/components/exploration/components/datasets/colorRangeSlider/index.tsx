import React, { useCallback, useEffect, useState, useRef } from 'react';

import './color-range-slider.scss';
import {
  sterlizeNumber,
  calculateStep,
  rangeCalculation,
  displayErrorMessage,
  textInputClasses,
  thumbPosition,
  tooltiptextClasses
} from './utils';

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
  const setDefaultMin = colorMapScale?.min ? colorMapScale.min : min;
  const setDefaultMax = colorMapScale?.max ? colorMapScale.max : max;

  const [minVal, setMinVal] = useState(setDefaultMin);
  const [maxVal, setMaxVal] = useState(setDefaultMax);
  const minValRef = useRef({ actual: setDefaultMin, display: setDefaultMin });
  const maxValRef = useRef({ actual: setDefaultMax, display: setDefaultMax });
  const [maxIsHovering, setMaxIsHovering] = useState(false);
  const [minIsHovering, setMinIsHovering] = useState(false);
  const digitCount = useRef<number>(1);
  const range = useRef<HTMLDivElement>(null);

  const [fieldFocused, setFieldFocused] = useState(false);
  const [inputError, setInputError] = useState({
    min: false,
    max: false,
    largerThanMax: false,
    lessThanMin: false
  });

  // Convert to percentage
  const getPercent = useCallback(
    (value) => ((value - min) * 100) / (max - min),
    [min, max]
  );

  const resetErrorOnSlide = (value, slider) => {
    if (value > min || value < max) {
      slider === 'max'
        ? setInputError({ ...inputError, max: false, lessThanMin: false })
        : setInputError({ ...inputError, min: false, largerThanMax: false });
    }
  };

  const minMaxBuffer = calculateStep(max, min, digitCount);

  useEffect(() => {
    let maxValPrevious;
    let minValPrevious;
    //checking that there are no current errors with inputs
    if (Object.values(inputError).every((error) => !error)) {
      //set the filled range bar on initial load
      if (
        colorMapScale &&
        maxVal != maxValPrevious &&
        minVal != minValPrevious
      ) {
        const minPercent = getPercent(minValRef.current.actual);
        const maxPercent = getPercent(maxValRef.current.actual);

        rangeCalculation(maxPercent, minPercent, range);

        if (range.current)
          range.current.style.left = `calc(${minPercent}% + ${
            10 - minPercent * 0.2
          }px)`;
      } else {
        //set the filled range bar if change to max slider
        if (maxVal != maxValPrevious) {
          maxValPrevious = maxVal;
          const minPercent = getPercent(minValRef.current.actual);
          const maxPercent = getPercent(maxVal);
          rangeCalculation(maxPercent, minPercent, range);
        }
        //set the filled range bar if change to min slider
        if (minVal != minValPrevious) {
          minValPrevious = minVal;
          const minPercent = getPercent(minVal);
          const maxPercent = getPercent(maxValRef.current.actual);
          rangeCalculation(maxPercent, minPercent, range);

          if (range.current)
            range.current.style.left = `calc(${minPercent}% + ${
              10 - minPercent * 0.2
            }px)`;
        }
      }
    }

    const maxCharacterCount = maxVal.toString().length + 1;
    const minCharacterCount = minVal.toString().length + 1;

    let updatedDisplay;
    maxCharacterCount <= 6
      ? (updatedDisplay = maxVal)
      : (updatedDisplay = maxVal.toExponential());
    maxValRef.current.display = updatedDisplay;

    minCharacterCount <= 6
      ? (updatedDisplay = minVal)
      : (updatedDisplay = minVal.toExponential());
    minValRef.current.display = updatedDisplay;
    // determining if there is an initial colorMapeScale or if it is the default min and max
    if (
      !colorMapScale ||
      (colorMapScale.max == max && colorMapScale.min == min)
    ) {
      setColorMapScale({ min: minVal, max: maxVal });
    } else
      setColorMapScale({
        min: Number(minValRef.current.actual),
        max: Number(maxValRef.current.actual)
      }); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [maxVal, minVal, getPercent, setColorMapScale, inputError, max, min]);

  return (
    <div className='border-bottom-1px padding-bottom-1 border-base-light width-full text-normal'>
      <form className='usa-form display-flex flex-row flex-justify flex-align-center padding-bottom-1'>
        <label className='font-ui-3xs text-gray-90 text-semibold margin-right-1 flex-1'>
          Rescale
        </label>
        <div>
          {minIsHovering && (
            <div className='position-relative tooltipcontainer'>
              <span className={`tooltiptext ${tooltiptextClasses} tooltipmin`}>
                {sterlizeNumber(minValRef.current.actual, digitCount)}
              </span>
            </div>
          )}

          <USWDSTextInput
            type='number'
            id='range slider min'
            name='min'
            className={`${textInputClasses} ${
              inputError.min || inputError.largerThanMax
                ? 'border-secondary-vivid text-secondary-vivid'
                : ' border-base-light'
            }`}
            data-testid='minInput'
            value={
              fieldFocused
                ? minValRef.current.actual
                : minValRef.current.display
            }
            placeholder={
              fieldFocused
                ? minValRef.current.actual
                : minValRef.current.display
            }
            onMouseEnter={() => setMinIsHovering(true)}
            onMouseLeave={() => setMinIsHovering(false)}
            onFocus={() => setFieldFocused(true)}
            onBlur={() => {
              setFieldFocused(false);
            }}
            onChange={(event) => {
              if (event.target.value != undefined) {
                minValRef.current.actual =
                  event.target.value === '' ? 0 : event.target.value;
                const value = Number(event.target.value);

                if (value > maxVal - minMaxBuffer)
                  return setInputError({ ...inputError, largerThanMax: true });
                if (value < min || value > max) {
                  return setInputError({ ...inputError, min: true });
                } else {
                  setInputError({
                    ...inputError,
                    min: false,
                    largerThanMax: false
                  });
                  const calculatedVal = Math.min(value, maxVal - minMaxBuffer);
                  setMinVal(calculatedVal);
                }
              }
            }}
          />
        </div>
        <div className='position-relative container display-flex flex-align-center flex-justify-center padding-x-105'>
          <input
            type='range'
            data-testid='minSlider'
            min={min}
            max={max}
            step={calculateStep(max, min, digitCount)}
            value={minVal}
            onChange={(event) => {
              const value = Math.min(
                Number(event.target.value),
                maxVal - minMaxBuffer
              );
              resetErrorOnSlide(value, 'min');
              setMinVal(value);
              minValRef.current.actual = value;
            }}
            className={`thumb ${thumbPosition} z-index-30`}
            style={{
              zIndex: minVal >= max - 10 * minMaxBuffer ? '500' : '300'
            }}
          />
          <input
            type='range'
            data-testid='maxSlider'
            min={min}
            max={max}
            step={calculateStep(max, min, digitCount)}
            value={maxVal}
            onChange={(event) => {
              const value = Math.max(
                Number(event.target.value),
                minVal + minMaxBuffer
              );
              resetErrorOnSlide(value, 'max');
              setMaxVal(value);
              maxValRef.current.actual = value;
            }}
            className={`thumb ${thumbPosition} z-400`}
            style={{
              zIndex: minVal <= max - 10 * minMaxBuffer ? '500' : '400'
            }}
          />
          <div className='slider width-card position-relative height-3 display-flex flex-align-center'>
            <div className='bg-base-lighter radius-md position-absolute height-05 z-100 width-full display-flex flex-align-center ' />
            <div
              ref={range}
              className='bg-primary-vivid display-flex flex-align-center flex-justify-center radius-md position-absolute height-05 z-200'
            >
              {/* Show divergent map middle point */}
              {min < 0 ? (
                <div className='position-relative height-2 width-1px bg-primary-darker ' />
              ) : null}
            </div>
          </div>
        </div>
        <div>
          {maxIsHovering && (
            <div className='position-relative tooltipcontainer'>
              <span
                className={`tooltiptext ${tooltiptextClasses} right-0 tooltipmax`}
              >
                {sterlizeNumber(maxValRef.current.actual, digitCount)}
              </span>
            </div>
          )}
          <USWDSTextInput
            type='number'
            data-validate-numerical='[0-9]*'
            id='range slider max'
            name='max'
            data-testid='maxInput'
            className={`${textInputClasses} ${
              inputError.max || inputError.lessThanMin
                ? 'border-secondary-vivid text-secondary-vivid'
                : ' border-base-light'
            }`}
            placeholder={
              fieldFocused
                ? maxValRef.current.actual
                : maxValRef.current.display
            }
            value={
              fieldFocused
                ? maxValRef.current.actual
                : maxValRef.current.display
            }
            onMouseEnter={() => setMaxIsHovering(true)}
            onMouseLeave={() => setMaxIsHovering(false)}
            onFocus={() => setFieldFocused(true)}
            onBlur={() => {
              setFieldFocused(false);
            }}
            onChange={(event) => {
              if (event.target.value != undefined) {
                maxValRef.current.actual =
                  event.target.value === '' ? 0 : event.target.value;
                const value = Number(event.target.value);

                if (value < minVal + minMaxBuffer)
                  return setInputError({ ...inputError, lessThanMin: true });

                if (value < min || value > max) {
                  return setInputError({ ...inputError, max: true });
                } else {
                  //unsetting error
                  setInputError({
                    ...inputError,
                    max: false,
                    lessThanMin: false
                  });
                  const calculatedVal = Math.max(value, minVal + minMaxBuffer);
                  setMaxVal(calculatedVal);
                }
              }
            }}
          />
        </div>
      </form>

      {displayErrorMessage(inputError, min, max, maxValRef, minValRef)}
    </div>
  );
}
