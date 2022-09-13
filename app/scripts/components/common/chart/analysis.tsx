import React from 'react';
import Chart, { CommonLineChartProps } from './';
interface AnalysisChartProps extends CommonLineChartProps {
  chartData: object[];
  dates: string[];
  uniqueKeys: string[];
}

export default function AnalysisChartProps(props: AnalysisChartProps) {
  return <Chart {...props} renderLegend={false} />;
}
