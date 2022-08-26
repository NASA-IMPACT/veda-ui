import React, { useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { scaleTime } from 'd3';

import { useChartDimensions } from './utils';
import { DataPoints, DataLine } from './data-points';
import TriggerRect from './trigger-rect';
import { TimeseriesContext } from './context';
import { FaderDefinition, MASK_ID } from './faders';
import DateAxis from './date-axis';
import { DATA_POINT_WIDTH, TimeseriesData } from './constants';

const StyledSvg = styled.svg`
  display: block;
  font-family: ${themeVal('type.base.family')};
`;

type TimeseriesControlProps = {
  data: TimeseriesData;
};

function TimeseriesControl(props: TimeseriesControlProps) {
  const { data } = props;
  const { observe, width, height, outerWidth, outerHeight, margin } =
    useChartDimensions();

  const svgRef = useRef<SVGElement>(null);
  const [zoomXTranslation, setZoomXTranslation] = useState(0);

  const x = useMemo(
    () =>
      scaleTime()
        .domain([data[0].date, data.last.date])
        .range([0, data.length * DATA_POINT_WIDTH]),
    [data]
  );

  const onChartZoom = useCallback((event) => {
    setZoomXTranslation(event.transform.x);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={observe}>
      <TimeseriesContext.Provider
        value={{
          data,
          width,
          height,
          outerWidth,
          outerHeight,
          margin,
          x,
          zoomXTranslation
        }}
      >
        <StyledSvg ref={svgRef} width={outerWidth} height={outerHeight}>
          <defs>
            <FaderDefinition />
          </defs>
          <g
            transform={`translate(${margin.left},${margin.top})`}
            id='canvas'
            mask={`url(#${MASK_ID})`}
          >
            <DataLine />
            <DataPoints />
            <TriggerRect onZoom={onChartZoom} />
            <DateAxis />
          </g>
        </StyledSvg>
      </TimeseriesContext.Provider>
    </div>
  );
}

TimeseriesControl.propTypes = {};

export default TimeseriesControl;
