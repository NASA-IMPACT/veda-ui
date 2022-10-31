import React, { useRef, useMemo } from 'react';
import styled from 'styled-components';
import ExportImage from './export-image';
import { getLegendStringForScreenshot } from './svg-legend';
import Chart, { CommonLineChartProps } from '$components/common/chart';
import {
  formatTimeSeriesData,
  getColors
} from '$components/common/chart/utils';

const Wrapper = styled.div`
  width: 100%;
  grid-column: 1/-1;
`;

interface AnalysisChartProps extends CommonLineChartProps {
  timeSeriesData: object[];
  dates: string[];
}

const syncId = 'analysis';

export default function AnalysisChart(props: AnalysisChartProps) {
  const { timeSeriesData, dates, uniqueKeys, dateFormat, xKey } = props;

  const chartRef = useRef(null);

  const chartData = useMemo(() => {
    return formatTimeSeriesData({
      timeSeriesData,
      dates,
      uniqueKeys,
      dateFormat,
      xKey
    });
  }, [timeSeriesData, dates, uniqueKeys, dateFormat, xKey]);

  const lineColors = useMemo(() => {
    return getColors({ steps: uniqueKeys.length, colorScheme: 'viridis' });
  }, [uniqueKeys]);

  return (
    <Wrapper>
      <Chart
        {...props}
        ref={chartRef}
        syncId={syncId}
        chartData={chartData}
        renderLegend={false}
        renderBrush={true}
        colors={lineColors}
      />
      <ExportImage
        svgWrapperRef={chartRef}
        legendSvgString={getLegendStringForScreenshot({
          uniqueKeys,
          lineColors
        })}
      />
    </Wrapper>
  );
}
