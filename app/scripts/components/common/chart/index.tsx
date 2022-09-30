import React, { RefObject, useState, useEffect, createRef } from 'react';
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
import {
  getColors,
  dateFormatter,
  convertToTime,
  syncMethodFunction
} from './utils';

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

function RLineChart(props: RLineChartProps, ref: RefObject<HTMLDivElement>) {
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
  return (
    <ChartWrapper>
      <ResponsiveContainer
        aspect={chartAspectRatio}
        debounce={500}
        height='auto'
        minHeight={chartMinHeight}
        maxHeight={chartMaxHeight}
      >
        <LineChartWithFont
          ref={ref}
          data={chartData}
          margin={chartMargin}
          syncId={syncId}
          syncMethod={(index: number, data: any) => {
            return syncMethodFunction({ data, chartData, xKey, dateFormat });
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

export default React.forwardRef(RLineChart);
