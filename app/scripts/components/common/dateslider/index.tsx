import React, { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { interpolate, scaleLinear, select, zoom } from 'd3';
import { themeVal } from '@devseed-ui/theme-provider';

import { findDate, getZoomTranslateExtent, useChartDimensions } from './utils';
import { DataPoints, DataLine } from './data-points';
import TriggerRect from './trigger-rect';
import { FaderDefinition, MASK_ID } from './faders';
import { DateAxis, DateAxisParent } from './date-axis';
import {
  DATA_POINT_WIDTH,
  DateSliderDataItem,
  DateSliderTimeDensity,
  RANGE_PADDING
} from './constants';

import { useEffectPrevious } from '$utils/use-effect-previous';
import useReducedMotion from '$utils/use-prefers-reduced-motion';

const StyledSvg = styled.svg`
  display: block;
  width: 100%;
  font-family: ${themeVal('type.base.family')};
`;

interface DateSliderControlProps {
  id?: string;
  data: DateSliderDataItem[];
  value?: Date;
  timeDensity: DateSliderTimeDensity;
  onChange: (value: { date: Date }) => void;
}

export default function DateSliderControl(props: DateSliderControlProps) {
  const { id, data, value, timeDensity, onChange } = props;
  const { observe, width, height, outerWidth, outerHeight, margin } =
    useChartDimensions();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveringDataPoint, setHoveringDataPoint] = useState(null);

  // Unique id creator
  const getUID = useMemo(() => {
    const rand = `ts-${Math.random().toString(36).substring(2, 8)}`;
    return (base) => `${id ?? rand}-${base}`;
  }, [id]);

  const x = useMemo(() => {
    const dataWidth = data.length * DATA_POINT_WIDTH;
    return scaleLinear()
      .domain([data[0].index, data.last.index])
      .range([RANGE_PADDING, Math.max(dataWidth, width) - RANGE_PADDING]);
  }, [data, width]);

  const [zoomXTranslation, setZoomXTranslation] = useState(0);
  const zoomBehavior = useMemo(
    () =>
      zoom<SVGRectElement, unknown>()
        .translateExtent(getZoomTranslateExtent(data, x))
        // Remove the zoom interpolation so it doesn't zoom back and forth.
        .interpolate(interpolate)
        .on('zoom', (event) => {
          setZoomXTranslation(event.transform.x);
        }),
    [data, x]
  );

  const onDataOverOut = useCallback(({ hover, date }) => {
    setHoveringDataPoint(date || null);

    if (svgRef.current) {
      svgRef.current.style.cursor = hover ? 'pointer' : 'ew-resize';
    }
  }, []);

  // Limit the data that is rendered so that performance is not hindered by very
  // large datasets.
  // Lower and Upper pixel bounds of the data that should be rendered taking the
  // horizontal drag window into account.
  const minX = zoomXTranslation * -1;
  const maxX = width - zoomXTranslation;
  // Using the scale, get the indexes of the data that would be rendered.
  const indexes = [
    Math.max(Math.floor(x.invert(minX)), 0),
    // Add one to account for when there's a single data point.
    Math.ceil(x.invert(maxX)) + 1
  ];

  const dataToRender = useMemo(
    () => data.slice(...indexes),
    [data, ...indexes]
  );

  // Recenter the slider to the selected date when data changes or when the
  // chart gets resized.
  const item = findDate(data, value, timeDensity);
  useRecenterSlider({ value: item?.index, width, x, zoomBehavior, svgRef });

  return (
    <div style={{ position: 'relative' }} ref={observe}>
      <StyledSvg ref={svgRef} width={outerWidth} height={outerHeight}>
        <defs>
          <FaderDefinition
            data={data}
            x={x}
            zoomXTranslation={zoomXTranslation}
            width={width}
            height={height}
            getUID={getUID}
          />
        </defs>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g mask={`url(#${getUID(MASK_ID)})`}>
            <DataLine x={x} zoomXTranslation={zoomXTranslation} />
            <DataPoints
              data={dataToRender}
              hoveringDataPoint={hoveringDataPoint}
              value={value}
              x={x}
              zoomXTranslation={zoomXTranslation}
              timeDensity={timeDensity}
            />
            <DateAxis
              data={dataToRender}
              x={x}
              zoomXTranslation={zoomXTranslation}
              timeDensity={timeDensity}
            />
          </g>
          <DateAxisParent
            data={dataToRender}
            x={x}
            zoomXTranslation={zoomXTranslation}
            timeDensity={timeDensity}
          />
          <TriggerRect
            onDataClick={onChange}
            onDataOverOut={onDataOverOut}
            width={width}
            height={height}
            data={data}
            x={x}
            zoomXTranslation={zoomXTranslation}
            zoomBehavior={zoomBehavior}
          />
        </g>
      </StyledSvg>
    </div>
  );
}

function useRecenterSlider({ value, width, x, zoomBehavior, svgRef }) {
  const reduceMotion = useReducedMotion();

  // The recenter function must be debounced because if it is triggered while
  // another animation is already running, the X translation extent gets messed
  // up. Debouncing a function with React is tricky. Since the function must
  // access "fresh" parameters it is defined through a ref and then invoked in
  // the debounced function created through useMemo.

  const recenterFnRef = useRef<() => void>();
  recenterFnRef.current = () => {
    if (isNaN(value)) return;

    select(svgRef.current)
      .select<SVGRectElement>('.trigger-rect')
      .transition()
      .duration(500)
      .call(zoomBehavior.translateTo, x(value), 0);
  };

  const debouncedRecenter = useMemo(
    () =>
      debounce(() => {
        recenterFnRef.current?.();
      }, 400),
    []
  );

  useEffectPrevious(
    (deps, mounted) => {
      if (isNaN(value) || !mounted) return;

      // No animation if reduce motion.
      if (reduceMotion) {
        zoomBehavior.translateTo(
          select(svgRef.current).select('.trigger-rect'),
          x(value),
          0
        );
        return;
      }

      debouncedRecenter();

      return () => {
        debouncedRecenter.cancel();
      };
    },
    [value, width, x, zoomBehavior]
  );
}
