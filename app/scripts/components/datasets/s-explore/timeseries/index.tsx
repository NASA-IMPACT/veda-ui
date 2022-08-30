import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { scaleTime, select, zoom } from 'd3';

import { getZoomTranslateExtent, useChartDimensions } from './utils';
import { DataPoints, DataLine } from './data-points';
import TriggerRect from './trigger-rect';
import { TimeseriesContext } from './context';
import { FaderDefinition, MASK_ID } from './faders';
import { DateAxis, DateAxisParent } from './date-axis';
import {
  DATA_POINT_WIDTH,
  TimeseriesData,
  TimeseriesTimeUnit
} from './constants';

const StyledSvg = styled.svg`
  display: block;
  font-family: ${themeVal('type.base.family')};
`;

type TimeseriesControlProps = {
  id?: string;
  data: TimeseriesData;
  value?: Date;
  timeUnit: TimeseriesTimeUnit;
  onChange: ({ date: Date }) => void;
};

function TimeseriesControl(props: TimeseriesControlProps) {
  const { id, data, value, timeUnit, onChange } = props;
  const { observe, width, height, outerWidth, outerHeight, margin } =
    useChartDimensions();
  const svgRef = useRef<SVGElement>(null);

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

  const onDataOverOut = useCallback(({ hover }) => {
    if (svgRef.current) {
      svgRef.current.style.cursor = hover ? 'pointer' : '';
    }
  }, []);

  useEffect(() => {
    if (!value) return;

    const triggerRect = select(svgRef.current).select<SVGRectElement>(
      '.trigger-rect'
    );

    function isDateInViewport(date) {
      const zoomProp = triggerRect.property('__zoom');
      const xTranslation = Math.max(zoomProp.x * -1, 0);
      const visibleArea = [xTranslation, xTranslation + width];
      const xPosOriginal = x(date);

      return xPosOriginal >= visibleArea[0] && xPosOriginal <= visibleArea[1];
    }

    if (!isDateInViewport(value)) {
      zoomBehavior.translateTo(triggerRect, x(value), 0);
    }
  }, [value, width, x, zoomBehavior]);

  return (
    <div style={{ position: 'relative' }} ref={observe}>
      <TimeseriesContext.Provider
        value={{
          data,
          value,
          width,
          height,
          outerWidth,
          outerHeight,
          margin,
          x,
          zoomXTranslation,
          zoomBehavior,
          timeUnit,
          getUID
        }}
      >
        <StyledSvg ref={svgRef} width={outerWidth} height={outerHeight}>
          <defs>
            <FaderDefinition />
          </defs>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <g mask={`url(#${getUID(MASK_ID)})`}>
              <DataLine />
              <DataPoints />
              <DateAxis />
            </g>
            <TriggerRect
              onDataClick={onChange}
              onDataOverOut={onDataOverOut}
            />
            <DateAxisParent />
          </g>
        </StyledSvg>
      </TimeseriesContext.Provider>
    </div>
  );
}

TimeseriesControl.propTypes = {};

export default TimeseriesControl;
