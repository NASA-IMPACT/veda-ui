import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import { csv, json } from 'd3-fetch';
import styled from 'styled-components';
import { timeFormat, timeParse } from 'd3-time-format';
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

const LineChartWithFont = styled(LineChart)`
  font-size: 12px;
`;

const getTicks = (data, xKey) => {
  return data.map((e) => new Date(e[xKey]));
};

const getDomain = (data, xKey) => {
  if (!data.length) return [0, 0];
  return [data[0][xKey], data[data.length - 1][xKey]];
};

const convertToTime = ({ timeString, dateFormat, debug }) => {
  if (debug) console.log(timeString);
  const parseDate = timeParse(dateFormat);

  return parseDate(timeString).getTime();
};

function getFData({ data, idKey, xKey, yKey, dateFormat }) {
  let uniqueKeys = [];
  const slicedData = data.reduce((acc, curr) => {
    if (!acc[curr[idKey]]) {
      uniqueKeys.push(curr[idKey]);
      acc[curr[idKey]] = [];
    }
    acc[curr[idKey]].push({
      [xKey]: convertToTime({ timeString: curr[xKey], dateFormat }),
      [curr[idKey]]: parseFloat(curr[yKey])
    });
    return acc;
  }, []);

  const fData = data.map((d) => {
    return {
      [xKey]: convertToTime({ timeString: d[xKey], dateFormat }),
      [d[idKey]]: parseFloat(d[yKey])
    };
  });
  return {
    uniqueKeys,
    slicedData,
    fData
  };
}

const CustomTooltip = ({ testData, active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className='custom-tooltip'>
        <p className='label'>
          {`${new Date(label)} : ${testData} ${payload[0].value}`}
        </p>
      </div>
    );
  }

  return null;
};

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

      const { fData, slicedData, uniqueKeys } = getFData({
        data,
        xKey,
        idKey,
        yKey,
        dateFormat
      });
      setChartData(fData);
      setUniqueKeys(uniqueKeys);
    };
    console.log(slicedData);
    getData();
  }, [setChartData, setUniqueKeys, idKey, xKey, yKey, dataPath, dateFormat]);
  console.log(uniqueKeys);
  console.log(chartData);
  const dateFormatter = (date) => {
    const format = timeFormat(dateFormat);
    return format(date);
  };

  const ticks = getTicks(chartData, xKey);
  const domain = getDomain(chartData, xKey);
  const lineColors = colors
    ? colors
    : getColors({ steps: uniqueKeys.length, colorScheme });
  return (
    <ResponsiveContainer width='100%' height='80%' maxHeight='400px'>
      <LineChartWithFont data={chartData}>
        <XAxis
          scale='time'
          type='number'
          dataKey={xKey}
          domain={domain}
          tickFormatter={dateFormatter}
          ticks={ticks}
        >
          <Label value={xAxisLabel} offset={0} position='insideBottom' />
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
              key={`${k}-line`}
              dataKey={k}
              stroke={lineColors[idx]}
            />
          );
        })}
        <Tooltip content={<CustomTooltip testData='data' />} />
      </LineChartWithFont>
    </ResponsiveContainer>
  );
};

export default RLineChart;
