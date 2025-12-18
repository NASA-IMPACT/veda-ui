import React from 'react';
import styled from 'styled-components';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

import { themeVal } from '@devseed-ui/theme-provider';

export interface RangeSliderInputProps {
  id?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  value: [number, number];
  onInput: (v: [number, number]) => void;
  disabled?: boolean;
  rangeSlideDisabled?: boolean;
  thumbsDisabled?: [boolean, boolean];
  orientation?: 'horizontal' | 'vertical';
}

export const RangeSliderInput = styled(RangeSlider)<RangeSliderInputProps>`
  && {
    background: ${themeVal('color.base-200')};
    border-radius: ${themeVal('shape.rounded')};

    .range-slider__range {
      border-radius: ${themeVal('shape.rounded')};
      background: ${themeVal('color.primary')};
    }

    .range-slider__thumb {
      transition: background 160ms ease-in-out;
      background: ${themeVal('color.surface')};
      box-shadow: ${themeVal('boxShadow.elevationD')};
      border: 1px solid ${themeVal('color.primary')};
      width: 1.25rem;
      height: 1.25rem;

      &:hover {
        background: ${themeVal('color.base-50')};
      }
    }

    .range-slider__thumb[data-lower] {
      display: none;
      width: 0;
    }
  }
`;

export interface SliderInputProps
  extends Omit<RangeSliderInputProps, 'value' | 'onInput' | 'defaultValue'> {
  value: number;
  onInput: (v: number) => void;
}

export function SliderInput(props: SliderInputProps) {
  const { value, onInput, ...rest } = props;

  return (
    <RangeSliderInput
      {...rest}
      value={[0, value]}
      onInput={(v) => onInput(v[1])}
      thumbsDisabled={[true, false]}
      rangeSlideDisabled
    />
  );
}


// @TECH-DEBT: We need to pass 'onPointerDownCapture' to HTML element to prevent dragging event from propagating.
// But existing input element uses Third party library, which makes it impossible to pass this even to HTML element level
// This element was created to provide a fast solution for this problem. In the future, we have to deprecate the one from the top
export function NativeSliderInput(props: SliderInputProps) {
  const { value, onInput, ...rest } = props;
  return (
    <input
      type='range'
      {...rest}
      value={value}
      onPointerDownCapture={e => e.stopPropagation()}
      onChange={e => onInput(parseInt(e.target.value))}
    />);
}
