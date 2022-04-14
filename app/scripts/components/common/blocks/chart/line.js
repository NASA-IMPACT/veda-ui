import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { csv, json } from 'd3-fetch';
import { ResponsiveLine } from '@nivo/line';
import { useMediaQuery } from '$utils/use-media-query';
import {
  chartMargin,
  chartTheme,
  fileExtensionRegex,
  getLegendConfig,
  getFormattedData,
  getBottomAxis,
  getColors
} from './utils';
import TooltipComponent from './tooltip';

export const chartHeight = '32rem';

const ChartWrapper = styled.div`
  width: 100%;
  height: ${chartHeight};
`;

const LineChart = ({
  dataPath,
  idKey,
  xKey,
  yKey,
  dateFormat,
  customLayerComponent
}) => {
  const [data, setData] = useState([]);
  const extension = fileExtensionRegex.exec(dataPath)[1];
  const { isMediumUp } = useMediaQuery();

  useEffect(() => {
    const getData = async () => {
      let data;
      if (extension === 'csv') data = await csv(dataPath);
      else data = await json(dataPath);
      const formattedData = getFormattedData({
        data,
        extension,
        idKey,
        xKey,
        yKey
      });
      setData(formattedData);
    };
    getData();
  }, [dataPath, idKey, xKey, yKey, extension]);
  return (
    <ChartWrapper>
      <ResponsiveLine
        data={data}
        animate={true}
        enableCrosshair={true}
        crosshairType='x'
        margin={chartMargin}
        xScale={{
          type: 'time',
          format: dateFormat
        }}
        colors={getColors(data.length)}
        xFormat={`time:${dateFormat}`}
        yScale={{
          type: 'linear',
          stacked: true
        }}
        enableGridX={false}
        enablePoints={false}
        enableSlices='x'
        axisBottom={getBottomAxis(dateFormat, isMediumUp)}
        legends={getLegendConfig(data, isMediumUp)}
        layers={[
          'grid',
          'markers',
          'areas',
          customLayerComponent,
          'lines',
          'crosshair',
          'slices',
          'axes',
          'points',
          'legends'
        ]}
        sliceTooltip={TooltipComponent}
        theme={chartTheme}
      />
    </ChartWrapper>
  );
};
LineChart.propTypes = {
  dataPath: T.string,
  idKey: T.string,
  xKey: T.string,
  yKey: T.string,
  dateFormat: T.string,
  customLayerComponent: T.func
};

export default LineChart;
