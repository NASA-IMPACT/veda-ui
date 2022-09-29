import React, { useRef, useMemo } from 'react';
import Chart, {
  LineChartWithRef,
  CommonLineChartProps
} from '$components/common/chart';
import {
  formatTimeSeriesData,
  getColors
} from '$components/common/chart/utils';
import ExportPNG from './export-png';
import { getLegendStringForScreenshot } from '../legend';

interface AnalysisChartProps extends CommonLineChartProps {
  timeSeriesData: object[];
  dates: string[];
}

export default function AnalysisChartProps(props: AnalysisChartProps) {
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
    <div>
      <LineChartWithRef
        {...props}
        ref={chartRef}
        chartData={chartData}
        renderLegend={false}
        renderBrush={true}
        renderExport={true}
      />
    </div>
  );
}
