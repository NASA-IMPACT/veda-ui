import React, { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { scaleTime } from 'd3';

import { useChartDimensions } from './utils';
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
  data: TimeseriesData;
  value?: Date;
  timeUnit: TimeseriesTimeUnit;
};

function TimeseriesControl(props: TimeseriesControlProps) {
  const { data, value, timeUnit } = props;
  const { observe, width, height, outerWidth, outerHeight, margin } =
    useChartDimensions();
  const svgRef = useRef<SVGElement>(null);
  const [zoomXTranslation, setZoomXTranslation] = useState(0);

  const getUID = useMemo(() => {
    const id = `ts-${Math.random().toString(36).substring(2, 8)}`;
    return (base) => `${id}-${base}`;
  }, []);

  const x = useMemo(() => {
    const dataWidth = data.length * DATA_POINT_WIDTH;
    return scaleTime()
      .domain([data[0].date, data.last.date])
      .range([16, Math.max(dataWidth, width) - 16]);
  }, [data, width]);

  const onChartZoom = useCallback((event) => {
    setZoomXTranslation(event.transform.x);
  }, []);

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
            <TriggerRect onZoom={onChartZoom} />
            <DateAxisParent />
          </g>
        </StyledSvg>
      </TimeseriesContext.Provider>
    </div>
  );
}

TimeseriesControl.propTypes = {};

export default TimeseriesControl;
