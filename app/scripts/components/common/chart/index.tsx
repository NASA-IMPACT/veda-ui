import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Label,
  Brush,
  ResponsiveContainer,
  ReferenceArea,
  Legend,
  Curve,
  Customized
} from 'recharts';

import TooltipComponent from './tooltip';
import AltTitle from './alt-title';
import { LegendComponent, ReferenceLegendComponent } from './legend';
import {
  getColors,
  timeFormatter,
  convertToTime,
  getNumForChart,
  syncMethodFunction
} from './utils';
import {
  chartMinHeight,
  chartMaxHeight,
  chartAspectRatio,
  defaultMargin,
  highlightColor,
  legendWidth,
  brushRelatedConfigs,
  brushHeight
} from './constant';
import { ChartWrapperRef } from './analysis/utils';
import { useMediaQuery } from '$utils/use-media-query';
import useBrush from '$components/analysis/results/useBrush';

const LineChartWithFont = styled(LineChart)`
  font-size: 0.8rem;
`;

const ChartWrapper = styled.div`
  width: 100%;
  grid-column: 1/-1;
`;

const BrushContainer = styled.div`
  position: relative;
  background: pink;
`;

const BrushNew = styled.div<{ x: number; width: number; height: number }>`
  position: absolute;
  top: 0;
  left: ${({ x }) => x}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const BrushComponent = styled.button`
  position: absolute;
  height: 100%;
  padding: 0;
  border: 1px solid rgb(110, 110, 110);
`;

const BrushTraveller = styled(BrushComponent)`
  width: 8px;
  cursor: ew-resize;
  z-index: 1;
  padding: 0;
  background: rgb(110, 110, 110);
`;

const BrushTravellerStart = styled(BrushTraveller)`
  left: -4px;
`;
const BrushTravellerEnd = styled(BrushTraveller)`
  right: -4px;
`;
const BrushDrag = styled(BrushComponent)`
  width: 100%;
  cursor: move;
  background: rgba(110, 110, 110, 0.3);
`;

export interface CommonLineChartProps {
  xKey: string;
  altTitle: string;
  altDesc: string;
  dateFormat: string;
  colors?: string[];
  colorScheme?: string;
  renderLegend?: boolean;
  renderBrush?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  highlightStart?: string;
  highlightEnd?: string;
  highlightLabel?: string;
  uniqueKeys: UniqueKeyUnit[];
  onBrushChange?: (idx: { startIndex: number; endIndex: number }) => void;
  defineRange: [Date, Date];
  brushRange: [Date, Date];
  onBrushRangeChange: (range: [Date, Date]) => void;
}

export interface UniqueKeyUnit {
  label: string;
  value: string;
  active: boolean;
  color?: string;
}

interface RLineChartProps extends CommonLineChartProps {
  chartData: object[];
  syncId?: string;
}

function CustomCursor(props) {
  // work around to disable cursor line when there is no matching index found
  // eslint-disable-next-line react/prop-types
  if (props.payloadIndex < 0) return null;
  return <Curve {...props} />;
}

export default React.forwardRef<ChartWrapperRef, RLineChartProps>(
  function RLineChart(props, ref) {
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
      yAxisLabel,
      onBrushChange,
      defineRange,
      brushRange,
      onBrushRangeChange
    } = props;

    const [chartMargin, setChartMargin] = useState(defaultMargin);
    const [brushStartIndex, setBrushStartIndex] = useState(0);
    const [brushEndIndex, setBrushEndIndex] = useState(chartData.length - 1);

    const { isMediumUp } = useMediaQuery();

    const handleBrushChange = useCallback(
      (newIndex) => {
        const { startIndex, endIndex } = newIndex;
        setBrushStartIndex(startIndex);
        setBrushEndIndex(endIndex);
        onBrushChange?.(newIndex);
      },
      [onBrushChange]
    );

    useEffect(() => {
      // Fire brush callback on mount to have the correct starting values.
      onBrushChange?.({ startIndex: 0, endIndex: chartData.length - 1 });
    }, []);

    useEffect(() => {
      if (!isMediumUp) {
        setChartMargin({
          ...defaultMargin,
          left: 0
        });
      }
    }, [isMediumUp]);

    const lineColors = useMemo(() => {
      return colors
        ? colors
        : getColors({ steps: uniqueKeys.length, colorScheme });
    }, [uniqueKeys, colorScheme, colors]);

    const uniqueKeysWithColors = useMemo(() => {
      return uniqueKeys.map((e, idx) => ({
        ...e,
        color: lineColors[idx]
      }));
    }, [uniqueKeys, lineColors]);

    const renderHighlight = !!(highlightStart ?? highlightEnd);

    const changeCallback = useCallback(
      (start, end) => {
        // console.log(start, end);
        onBrushRangeChange([start, end]);
      },
      [onBrushRangeChange]
    );

    const {
      brushX,
      brushWidth,
      onBrushMouseDown,
      onBrushMouseUp,
      onBrushMouseMove
    } = useBrush(440, defineRange, brushRange, changeCallback);


    const xAxisDomain = useMemo(() => {
      console.log(brushRange)
      return [+brushRange[0], +brushRange[1]];
    }, [brushRange]);

    const brusXAxisDomain = useMemo(() => {
      return [+defineRange[0], +defineRange[1]];
    }, [defineRange]);

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
            ref={ref as any}
            data={chartData}
            margin={chartMargin}
            // syncId={syncId}
            // syncMethod={(tick, data) => {
            //   const index = syncMethodFunction({
            //     data,
            //     chartData,
            //     xKey,
            //     dateFormat,
            //     startDate: chartData[brushStartIndex][xKey],
            //     endDate: chartData[brushStartIndex][xKey]
            //   });
            //   return index;
            // }}
          >
            <AltTitle title={altTitle} desc={altDesc} />
            <CartesianGrid stroke='#efefef' vertical={false} />
            <XAxis
              type='number'
              scale='time'
              domain={xAxisDomain}
              dataKey={xKey}
              axisLine={false}
              tickFormatter={(t) => timeFormatter(t, dateFormat)}
              allowDataOverflow={true}
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
            <YAxis axisLine={false} tickFormatter={(t) => getNumForChart(t)}>
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
                {!!highlightLabel && (
                  <Customized
                    component={
                      <ReferenceLegendComponent
                        highlightLabel={highlightLabel}
                      />
                    }
                  />
                )}
              </>
            )}
            {uniqueKeysWithColors.map((k) => {
              return (
                <Line
                  type='linear'
                  isAnimationActive={false}
                  dot={false}
                  activeDot={false}
                  key={`${k.value}-line`}
                  dataKey={k.label}
                  strokeWidth={2}
                  stroke={k.active ? k.color : 'transparent'}
                />
              );
            })}
            <Tooltip
              cursor={<CustomCursor />}
              content={
                <TooltipComponent
                  dateFormat={dateFormat}
                  uniqueKeys={uniqueKeysWithColors}
                />
              }
            />

            {renderLegend && uniqueKeysWithColors.length > 1 && (
              <Legend
                verticalAlign='bottom'
                width={legendWidth}
                wrapperStyle={{ width: '100%' }}
                content={<LegendComponent />}
              />
            )}

            {renderBrush && (
              <Brush
                data={chartData}
                dataKey={xKey}
                height={brushHeight}
                tickFormatter={(t) => timeFormatter(t, dateFormat)}
                onChange={handleBrushChange}
                startIndex={brushStartIndex}
                endIndex={brushEndIndex}
              >
                <LineChart data={chartData}>
                  {uniqueKeysWithColors.map((k) => {
                    return (
                      <Line
                        type='linear'
                        isAnimationActive={false}
                        dot={false}
                        activeDot={false}
                        key={`${k.value}-line-brush`}
                        dataKey={k.label}
                        strokeWidth={0.5}
                        stroke={k.active ? k.color : 'transparent'}
                      />
                    );
                  })}
                </LineChart>
              </Brush>
            )}
          </LineChartWithFont>
        </ResponsiveContainer>
        <BrushContainer>
          <ResponsiveContainer
            aspect={chartAspectRatio}
            debounce={500}
            // height={80}
            // minHeight={chartMinHeight}
            maxHeight={brushHeight}
            width={440}
          >
            <LineChart data={chartData}>
            <XAxis
              type='number'
              scale='time'
              domain={brusXAxisDomain}
              dataKey={xKey}
              axisLine={false}
              tickFormatter={(t) => timeFormatter(t, dateFormat)}
              height={40}
            />
              {uniqueKeysWithColors.map((k) => {
                return (
                  <Line
                    type='linear'
                    isAnimationActive={false}
                    dot={false}
                    activeDot={false}
                    key={`${k.value}-line-brush_`}
                    dataKey={k.label}
                    strokeWidth={0.5}
                    stroke={k.active ? k.color : 'transparent'}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
          <BrushNew
            height={brushHeight}
            onMouseDown={onBrushMouseDown}
            onMouseUp={onBrushMouseUp}
            onMouseMove={onBrushMouseMove}
            x={brushX}
            width={brushWidth}
          >
            <BrushTravellerStart data-role='start' />
            <BrushDrag data-role='drag' />
            <BrushTravellerEnd data-role='end' />
          </BrushNew>
        </BrushContainer>
      </ChartWrapper>
    );
  }
);
