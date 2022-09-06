import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  ReferenceArea,
  Legend,
  Customized
} from 'recharts';

import { useMediaQuery } from '$utils/use-media-query';

import { getColors } from './utils';

import TooltipComponent from './tooltip';
import { LegendComponent, ReferenceLegendComponent } from './legend';
import AltTitle from './alt-title';

import { dateFormatter, convertToTime } from './utils';
import { chartHeight, defaultMargin, highlightColor, legendWidth } from './constant';

const LineChartWithFont = styled(LineChart)`
  font-size: 0.8rem;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: ${chartHeight};
`;

// interface DataUinit {
//   [key: string]: Date;
// }

export interface CommonLineChartProps {
  xKey: string;
  altTitle: string;
  altDesc: string;
  dateFormat: string;
  colors: string[];
  colorScheme: string;
  renderLegend?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  highlightStart?: string;
  highlightEnd?: string;
  highlightLabel: string;
}

interface RLineChartProps extends CommonLineChartProps {
  chartData: object[];
  uniqueKeys: string[];
}

const RLineChart = function (props: RLineChartProps) {
  const {
    chartData,
    uniqueKeys,
    xKey,
    colors,
    colorScheme = 'viridis',
    dateFormat,
    altTitle,
    altDesc,
    renderLegend = false,
    highlightStart,
    highlightEnd,
    highlightLabel,
    xAxisLabel,
    yAxisLabel
  } = props;
  const [chartMargin, setChartMargin] = useState(defaultMargin);
  const [lineColors, setLineColors] = useState(colors);
  const { isMediumUp } = useMediaQuery();

  useEffect(() => {
    if (isMediumUp) {
      return;
    } else {
      setChartMargin({
        ...defaultMargin,
        left: 0
      });
    }
  }, [isMediumUp]);
  
  useEffect(() => {
    const lineColors = colors
      ? colors
      : getColors({ steps: uniqueKeys.length, colorScheme });

    setLineColors(lineColors);
  }, [uniqueKeys, colors, colorScheme]);

  const renderHighlight = highlightStart || highlightEnd;

  return (
    <ChartWrapper>
      <ResponsiveContainer debounce={500}>
        <LineChartWithFont data={chartData} margin={chartMargin}>
          <AltTitle title={altTitle} desc={altDesc} />
          <CartesianGrid stroke='#efefef' vertical={false} />
          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickFormatter={(t) => dateFormatter(t, dateFormat)}
          >
            <Label value={xAxisLabel} offset={-5} position='bottom' />
          </XAxis>
          <YAxis axisLine={false}>
            <Label value={yAxisLabel} angle={-90} position='insideLeft' />
          </YAxis>
          {renderHighlight && (
            <>
              <ReferenceArea
                x1={convertToTime({
                  timeString: highlightStart,
                  dateFormat
                })}
                x2={convertToTime({
                  timeString: highlightEnd,
                  dateFormat
                })}
                fill={highlightColor}
                isFront={true}
              />
              <Customized
                component={
                  <ReferenceLegendComponent highlightLabel={highlightLabel} />
                }
              />
            </>
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
                strokeWidth={2}
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

          {renderLegend && 
            <Legend
              verticalAlign='bottom'
              width={legendWidth}
              wrapperStyle={{ width: '100%' }}
              content={<LegendComponent />}
            />}
          {/* <Brush dataKey={xKey} /> */}
        </LineChartWithFont>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default RLineChart;
