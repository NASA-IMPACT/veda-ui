import React, { useMemo } from 'react';
import Chart, { CommonLineChartProps } from '$components/common/chart';
import { formatTimeSeriesData } from '$components/common/chart/utils';

interface AnalysisChartProps extends CommonLineChartProps {
  timeSeriesData: object[];
  dates: string[];
}

export default function AnalysisChartProps(props: AnalysisChartProps) {
  const { timeSeriesData, dates, uniqueKeys, dateFormat, xKey } = props;

  const chartData = useMemo(() => {
    return formatTimeSeriesData({
      timeSeriesData,
      dates,
      uniqueKeys,
      dateFormat,
      xKey
    });
  }, [timeSeriesData, dates, uniqueKeys, dateFormat, xKey]);

  return (
    <Chart
      {...props}
      chartData={chartData}
      renderLegend={false}
      renderBrush={true}
      renderExport={true}
    />
  );
}
