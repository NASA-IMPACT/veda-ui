import React, { useState, useEffect } from 'react';
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
import renderBrushComponent from './brush';
import TooltipComponent from './tooltip';
import AltTitle from './alt-title';

import { LegendComponent, ReferenceLegendComponent } from './legend';
import { getColors, dateFormatter, convertToTime } from './utils';
import {
  chartMinHeight,
  chartMaxHeight,
  chartAspectRatio,
  defaultMargin,
  highlightColor,
  legendWidth,
  brushRelatedConfigs
} from './constant';

const LineChartWithFont = styled(LineChart)`
  font-size: 0.8rem;
`;

const ChartWrapper = styled.div`
  width: 100%;
  grid-column: 1/-1;
`;

export interface CommonLineChartProps {
  xKey: string;
  altTitle: string;
  altDesc: string;
  dateFormat: string;
  colors: string[];
  colorScheme: string;
  renderLegend?: boolean;
  renderBrush?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  highlightStart?: string;
  highlightEnd?: string;
  highlightLabel: string;
  uniqueKeys: UniqueKeyUnit[];
}

export interface UniqueKeyUnit {
  label: string;
  value: string;
  active: boolean;
}
interface RLineChartProps extends CommonLineChartProps {
  chartData: object[];
  syncId?: string;
}

export default function RLineChart(props: RLineChartProps) {
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
    renderBrush = false,
    syncId,
    highlightStart,
    highlightEnd,
    highlightLabel,
    xAxisLabel,
    yAxisLabel
  } = props;

  const [chartMargin, setChartMargin] = useState(defaultMargin);

  const { isMediumUp } = useMediaQuery();

  useEffect(() => {
    if (!isMediumUp) {
      setChartMargin({
        ...defaultMargin,
        left: 0
      });
    }
  }, [isMediumUp]);

  const lineColors = colors
    ? colors
    : getColors({ steps: uniqueKeys.length, colorScheme });

  const renderHighlight = highlightStart || highlightEnd;

  function findMatching(date1, date2) {
    const formatted1 = dateFormatter(date1, dateFormat);
    const formatted2 = dateFormatter(date2, dateFormat);
    if (formatted1 === formatted2) return true;
    return false;
  }
  function findReverseMatching(date1, date2, formatterFromData) {
    const formatted1 = formatterFromData(date1, dateFormat);
    const formatted2 = formatterFromData(date2, dateFormat);
    if (formatted1 === formatted2) return true;
    return false;
  }
  const syncMethodFunction = (index, data, chartData, xKey) => {
    const { activeLabel } = data;
    const formatterFromData = data.activePayload[0].formatter;

    let matchingIndex;
    for (let i = 0; i < chartData.length; i++) {
      const e = chartData[i];
      if (findMatching(e[xKey], activeLabel)) {
        matchingIndex = i;
        break;
      }
    }
    if (matchingIndex === undefined) {
      for (let i = 0; i < chartData.length; i++) {
        const e = chartData[i];
        if (findReverseMatching(e[xKey], activeLabel, formatterFromData)) {
          matchingIndex = i;
          break;
        }
      }
    }
    return matchingIndex;
  };

  return (
    <ChartWrapper>
      <ResponsiveContainer
        aspect={chartAspectRatio}
        debounce={500}
        minHeight={chartMinHeight}
        maxHeight={chartMaxHeight}
      >
        <LineChartWithFont
          data={chartData}
          margin={chartMargin}
          syncId={syncId}
          syncMethod={(index, data) => {
            return syncMethodFunction(index, data, chartData, xKey);
          }}
        >
          <AltTitle title={altTitle} desc={altDesc} />
          <CartesianGrid stroke='#efefef' vertical={false} />
          <XAxis
            type='number'
            scale='time'
            domain={['dataMin', 'dataMax']}
            dataKey={xKey}
            axisLine={false}
            tickFormatter={(t) => dateFormatter(t, dateFormat)}
            height={
              renderBrush
                ? brushRelatedConfigs.with.xAxisHeight
                : brushRelatedConfigs.without.xAxisHeight
            }
          >
            <Label
              value={xAxisLabel}
              offset={
                renderBrush
                  ? brushRelatedConfigs.with.labelOffset
                  : brushRelatedConfigs.without.labelOffset
              }
              position='bottom'
            />
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
                key={`${k.value}-line`}
                dataKey={k.label}
                strokeWidth={2}
                stroke={k.active ? lineColors[idx] : 'transparent'}
                formatter={(value) => dateFormatter(value, dateFormat)}
              />
            );
          })}
          <Tooltip
            labelFormatter={() => undefined}
            content={
              <TooltipComponent
                dateFormat={dateFormat}
                xKey={xKey}
                uniqueKeys={uniqueKeys}
                colors={lineColors}
              />
            }
          />

          {renderLegend && (
            <Legend
              verticalAlign='bottom'
              width={legendWidth}
              wrapperStyle={{ width: '100%' }}
              content={<LegendComponent />}
            />
          )}
          {renderBrush &&
            renderBrushComponent({
              chartData,
              xKey,
              uniqueKeys,
              lineColors,
              dateFormat
            })}
        </LineChartWithFont>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
