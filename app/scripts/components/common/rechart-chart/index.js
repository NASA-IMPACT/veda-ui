import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import { csv, json } from 'd3-fetch';
import styled from 'styled-components';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';

import { getColors } from '$components/common/blocks/chart/utils';
import TooltipComponent from './tooltip';
import {
  dateFormatter,
  getTicks,
  getDomain,
  getFData,
  convertToTime
} from './utils';

const LineChartWithFont = styled(LineChart)`
  font-size: 12px;
`;

const RLineChart = function ({
  dataPath,
  idKey,
  xKey,
  yKey,
  colors,
  colorScheme = 'viridis',
  dateFormat,
  highlightStart,
  highlightEnd,
  highlightLabel,
  xAxisLabel,
  yAxisLabel
}) {
  const [chartData, setChartData] = useState([]);
  const [uniqueKeys, setUniqueKeys] = useState([]);
  useEffect(() => {
    const getData = async () => {
      let data = await csv(dataPath);

      const { fData, uniqueKeys } = getFData({
        data,
        xKey,
        idKey,
        yKey,
        dateFormat
      });
      setChartData(fData);
      setUniqueKeys(uniqueKeys);
    };

    getData();
  }, [setChartData, setUniqueKeys, idKey, xKey, yKey, dataPath, dateFormat]);
  const ticks = getTicks(chartData, xKey);
  const domain = getDomain(chartData, xKey);
  const lineColors = colors
    ? colors
    : getColors({ steps: uniqueKeys.length, colorScheme });
  return (
    <ResponsiveContainer width='100%' height='80%' maxHeight='400px'>
      <LineChartWithFont
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20
        }}
      >
        <XAxis
          scale='time'
          type='number'
          dataKey={xKey}
          domain={domain}
          tickFormatter={(t) => dateFormatter(t, dateFormat)}
          ticks={ticks}
        >
          <Label value={xAxisLabel} offset={0} position='bottom' />
        </XAxis>
        <YAxis>
          <Label value={yAxisLabel} angle={-90} position='insideLeft' />
        </YAxis>
        {highlightStart && (
          <ReferenceArea
            x1={convertToTime({
              timeString: highlightStart,
              dateFormat
            })}
            x2={convertToTime({
              timeString: highlightEnd,
              dateFormat
            })}
            label={highlightLabel}
          />
        )}
        {uniqueKeys.map((k, idx) => {
          return (
            <Line
              type='linear'
              isAnimationActive={false}
              dot={false}
              activeDot={false}
              key={`${k}-line`}
              dataKey={k}
              stroke={lineColors[idx]}
            />
          );
        })}
        <Tooltip
          content={
            <TooltipComponent
              chartData={chartData}
              dateFormat={dateFormat}
              xKey={xKey}
              colors={lineColors}
            />
          }
        />
      </LineChartWithFont>
    </ResponsiveContainer>
  );
};

export default RLineChart;
