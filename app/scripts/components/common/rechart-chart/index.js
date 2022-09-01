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
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { getColors } from '$components/common/blocks/chart/utils';
import { useMediaQuery } from '$utils/use-media-query';

import TooltipComponent from './tooltip';
import LegendComponent, { ReferenceLegendComponent } from './legend';
import AltTitle from './alt-title';

import { dateFormatter, convertToTime } from './utils';
import {
  chartHeight,
  defaultMargin,
  highlightColorThemeValue,
  highlightColor
} from './constants';

const LineChartWithFont = styled(LineChart)`
  font-size: 0.8rem;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: ${chartHeight};
`;

const StyledReferenceArea = styled(ReferenceArea)`
  fill: ${themeVal(highlightColorThemeValue)} !important;
`;

const RLineChart = function ({
  chartData,
  uniqueKeys,
  xKey,
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
  const [chartMargin, setChartMargin] = useState(defaultMargin);
  const { isMediumUp } = useMediaQuery();

  const lineColors = colors
    ? colors
    : getColors({ steps: uniqueKeys.length, colorScheme });

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
          <Legend
            verticalAlign='bottom'
            width='500px'
            wrapperStyle={{ width: '100%' }}
            content={<LegendComponent />}
          />
          {/* <Brush dataKey={xKey} /> */}
        </LineChartWithFont>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

RLineChart.propTypes = {
  chartData: T.array,
  uniqueKeys: T.array,
  xKey: T.string,
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
