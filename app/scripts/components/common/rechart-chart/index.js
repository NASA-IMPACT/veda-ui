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
  Brush,
  Label,
  ResponsiveContainer,
  ReferenceArea,
  Legend
} from 'recharts';

import { getColors } from '$components/common/blocks/chart/utils';
import TooltipComponent from './tooltip';
import { dateFormatter, getFData, convertToTime } from './utils';

const LineChartWithFont = styled(LineChart)`
  font-size: 12px;
`;

const syncId = 'syncsync';

const syncMethodFunction = (index, data, chartData, xKey) => {
  return chartData.findIndex((e) => {
    return (
      new Date(e[xKey]).getYear() ===
      new Date(data.activePayload[0].payload[xKey]).getYear()
    );
  });
};

const RLineChart = function ({
  dataPath,
  idKey,
  xKey,
  yKey,
  colors,
  colorScheme = 'viridis',
  dateFormat,
  altTitle,
  altDesc,
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
          dataKey={xKey}
          tickFormatter={(t) => dateFormatter(t, dateFormat)}
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
              dateFormat={dateFormat}
              xKey={xKey}
              colors={lineColors}
            />
          }
        />
        <Legend verticalAlign='bottom' align='center' iconType='rect' />
        {/* <Brush dataKey={xKey} /> */}
      </LineChartWithFont>
    </ResponsiveContainer>
  );
};

RLineChart.propTypes = {
  dataPath: T.string,
  idKey: T.string,
  xKey: T.string,
  yKey: T.string,
  xAxisLabel: T.string,
  yAxisLabel: T.string,
  altTitle: T.string,
  altDesc: T.string,
  dateFormat: T.string,
  colors: T.array,
  colorScheme: T.string,
  highlightStart: T.string,
  highlightEnd: T.string,
  highlightLabel: T.string
};

export default RLineChart;
