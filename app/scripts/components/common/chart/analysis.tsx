import React from 'react';
import Chart, { CommonLineChartProps } from './';
import { formatTimeSeriesData } from './utils';
interface AnalysisChartProps extends CommonLineChartProps {
  chartData: object[];
  dates: string[];
  uniqueKeys: string[];
}

export default function AnalysisChartProps(props: AnalysisChartProps) {
  const { chartData, dates, uniqueKeys, dateFormat, xKey } = props;
  return (
    <Chart
      {...props}
      renderLegend={false}
      chartData={formatTimeSeriesData({
        timeSeriesData: chartData,
        dates,
        uniqueKeys,
        dateFormat,
        xKey
      })}
    />
  );
}
