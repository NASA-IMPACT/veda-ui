import React, { useRef, useMemo, useImperativeHandle } from 'react';
import styled from 'styled-components';
import FileSaver from 'file-saver';

import { ChartWrapperRef, exportImage } from './utils';
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

export interface AnalysisChartRef {
  instance: ChartWrapperRef | null;
  saveAsImage: (name?: string) => Promise<void>;
}

const syncId = 'analysis';

export default React.forwardRef<AnalysisChartRef, AnalysisChartProps>(
  function AnalysisChart(props, ref) {
    const { timeSeriesData, dates, uniqueKeys, dateFormat, xKey } = props;

    const chartRef = useRef<ChartWrapperRef>(null);

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

    useImperativeHandle(ref, () => ({
      instance: chartRef.current,
      saveAsImage: async (name = 'chart') => {
        if (!chartRef.current) return;

        const chartImageUrl = await exportImage({
          svgWrapperRef: chartRef,
          legendSvgString: getLegendStringForScreenshot({
            uniqueKeys,
            lineColors
          })
        });
        FileSaver.saveAs(chartImageUrl, `${name}.jpg`);
      }
    }));

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
      </Wrapper>
    );
  }
);
