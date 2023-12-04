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
  // onThumbDragStart;
  // onThumbDragEnd;
  // onRangeDragStart;
  // onRangeDragEnd;
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
  extends Omit<RangeSliderInputProps, 'value' | 'onInput'> {
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
