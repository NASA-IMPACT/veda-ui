import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { csv, json } from 'd3-fetch';
import { ResponsiveLine } from '@nivo/line';
import { useMediaQuery } from '$utils/use-media-query';
import {
  defaultChartMargin,
  chartTheme,
  fileExtensionRegex,
  getLegendConfig,
  getFormattedData,
  getBottomAxis,
  getColors,
  getLeftAxis,
  smallScreenItemNum,
  largeScreenItemNum,
  chartBottomPadding,
  itemHeight
} from './utils';
import TooltipComponent from './tooltip';
import Title from './title-desc';

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
  colors,
  colorScheme = 'viridis',
  dateFormat,
  xAxisLabel,
  yAxisLabel,
  customLayerComponents
}) => {
  const [data, setData] = useState([]);
  // Nivo's auto scale for negative value only doesn't seem to work.
  // This is a temporary work around.
  const [chartMargin, setChartMargin] = useState(defaultChartMargin);
  const [yScale, setYScale] = useState({ min: 0, max: 0 });
  const newDataPath = dataPath.split('?')[0];
  const extension = fileExtensionRegex.exec(newDataPath)[1];
  const { isMediumUp } = useMediaQuery();

  useEffect(() => {
    const getData = async () => {
      let data;
      if (extension === 'csv') data = await csv(dataPath);
      else data = await json(dataPath);
      const {
        dataWId: formattedData,
        minY,
        maxY
      } = getFormattedData({
        data,
        extension,
        idKey,
        xKey,
        yKey
      });
      setYScale({ min: minY, max: maxY });
      setData(formattedData);
    };
    getData();
  }, [dataPath, idKey, xKey, yKey, extension]);

  useEffect(() => {
    isMediumUp
      ? setChartMargin({
          ...defaultChartMargin,
          bottom:
            Math.ceil(data.length / largeScreenItemNum) * itemHeight +
            chartBottomPadding
        })
      : setChartMargin({
          ...defaultChartMargin,
          bottom:
            Math.ceil(data.length / smallScreenItemNum) * itemHeight +
            chartBottomPadding
        });
  }, [isMediumUp, data.length]);

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
          format: dateFormat,
          useUTC: false
        }}
        colors={
          colors ? colors : getColors({ steps: data.length, colorScheme })
        }
        xFormat={`time:${dateFormat}`}
        yScale={{
          type: 'linear',
          min: yScale.min,
          max: yScale.max,
          stacked: false
        }}
        enableGridX={false}
        enablePoints={false}
        enableSlices='x'
        axisBottom={getBottomAxis({
          dateFormat,
          isLargeScreen: isMediumUp,
          xAxisLabel
        })}
        axisLeft={getLeftAxis(yAxisLabel)}
        legends={getLegendConfig({ data, isMediumUp, colors, colorScheme })}
        layers={[
          Title,
          'grid',
          'markers',
          'areas',
          ...customLayerComponents,
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
  colors: T.array,
  colorScheme: T.string,
  xAxisLabel: T.string,
  yAxisLabel: T.string,
  dateFormat: T.string,
  customLayerComponents: T.array
};

export default LineChart;
