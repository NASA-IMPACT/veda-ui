import React, { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import { scaleTime, select, zoom } from 'd3';
import { themeVal } from '@devseed-ui/theme-provider';

import { useEffectPrevious } from '$utils/use-effect-previous';
import { getZoomTranslateExtent, useChartDimensions } from './utils';
import { DataPoints, DataLine } from './data-points';
import TriggerRect from './trigger-rect';
import { FaderDefinition, MASK_ID } from './faders';
import { DateAxis, DateAxisParent } from './date-axis';
import {
  DATA_POINT_WIDTH,
  DateSliderData,
  DateSliderTimeDensity
} from './constants';
import useReducedMotion from '$utils/use-prefers-reduced-motion';

const StyledSvg = styled.svg`
  display: block;
  width: 100%;
  font-family: ${themeVal('type.base.family')};
`;

type DateSliderControlProps = {
  id?: string;
  data: DateSliderData;
  value?: Date;
  timeDensity: DateSliderTimeDensity;
  onChange: (value: { date: Date }) => void;
};

export default function DateSliderControl(props: DateSliderControlProps) {
  const { id, data, value, timeDensity, onChange } = props;
  const { observe, width, height, outerWidth, outerHeight, margin } =
    useChartDimensions();
  const svgRef = useRef<SVGElement>(null);
  const [hoveringDataPoint, setHoveringDataPoint] = useState(null);

  // Unique id creator
  const getUID = useMemo(() => {
    const rand = `ts-${Math.random().toString(36).substring(2, 8)}`;
    return (base) => `${id || rand}-${base}`;
  }, [id]);

  const x = useMemo(() => {
    const dataWidth = data.length * DATA_POINT_WIDTH;
    return scaleTime()
      .domain([data[0].date, data.last.date])
      .range([16, Math.max(dataWidth, width) - 16]);
  }, [data, width]);

  const [zoomXTranslation, setZoomXTranslation] = useState(0);
  const zoomBehavior = useMemo(
    () =>
      zoom<SVGRectElement, unknown>()
        .translateExtent(getZoomTranslateExtent(data, x))
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

  // Recenter the slider to the selected date when data changes or when the
  // chart gets resized.
  useRecenterSlider({ value, width, x, zoomBehavior, svgRef });

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
            <DataLine data={data} x={x} zoomXTranslation={zoomXTranslation} />
            <DataPoints
              data={data}
              hoveringDataPoint={hoveringDataPoint}
              value={value}
              x={x}
              zoomXTranslation={zoomXTranslation}
              timeDensity={timeDensity}
            />
            <DateAxis
              data={data}
              x={x}
              zoomXTranslation={zoomXTranslation}
              timeDensity={timeDensity}
            />
          </g>
          <DateAxisParent
            data={data}
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
    if (!value) return;

    const triggerRect = select(svgRef.current)
      .select<SVGRectElement>('.trigger-rect')
      .transition()
      .duration(500);
    zoomBehavior.translateTo(triggerRect, x(value), 0);
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
      if (!value || !mounted) return;

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
