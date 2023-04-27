import React, { Fragment } from 'react';
import { ScaleTime } from 'd3';
import { DateSliderData } from './constants';

import { getZoomTranslateExtent } from './utils';

export const MASK_ID = 'gradient-mask';
const FADE_ID = 'fade-gradient';

interface FaderDefinitionProps {
  data: DateSliderData;
  x: ScaleTime<number, number, never>;
  zoomXTranslation: number;
  width: number;
  height: number;
  getUID: (base: string) => string;
}

export function FaderDefinition(props: FaderDefinitionProps) {
  const { zoomXTranslation, width, height, data, x, getUID } = props;

  const [[xMinExtent], [xMaxExtent]] = getZoomTranslateExtent(data, x);

  // Invert the value.
  const xTranslation = zoomXTranslation * -1;

  // Fade the masks.
  // Fade in 5px (1/5)
  const fadePx = 1 / 5;
  const maxX = xMaxExtent - width;
  const minX = xMinExtent;

  // Decreasing straight line equation.
  // y = -mx + b
  const b = 1 + fadePx * minX;
  const leftOpc = Math.max(-fadePx * xTranslation + b, 0);

  // Increasing straight line equation.
  // y = mx + b
  const b2 = 1 - fadePx * maxX;
  const rightOpc = Math.max(fadePx * xTranslation + b2, 0);

  return (
    <Fragment>
      <linearGradient id={getUID(FADE_ID)}>
        <stop
          className='fade-stop-0'
          stopOpacity={leftOpc}
          stopColor='#fff'
          offset='0%'
        />
        <stop
          className='fade-stop-10'
          stopOpacity={1}
          stopColor='#fff'
          offset='10%'
        />
        <stop
          className='fade-stop-90'
          stopOpacity={1}
          stopColor='#fff'
          offset='90%'
        />
        <stop
          className='fade-stop-100'
          stopOpacity={rightOpc}
          stopColor='#fff'
          offset='100%'
        />
      </linearGradient>
      <mask id={getUID(MASK_ID)}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={`url(#${getUID(FADE_ID)})`}
        />
      </mask>
    </Fragment>
  );
}
