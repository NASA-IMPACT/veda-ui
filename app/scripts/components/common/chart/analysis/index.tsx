import React, { useRef, useMemo, useImperativeHandle } from 'react';
import styled from 'styled-components';
import FileSaver from 'file-saver';

import { ChartWrapperRef, exportImage } from './utils';
import { getLegendStringForScreenshot } from './svg-legend';
import Chart, { CommonLineChartProps } from '$components/common/chart';
import { formatTimeSeriesData } from '$components/common/chart/utils';

const Wrapper = styled.div`
  width: 100%;
  grid-column: 1/-1;
`;

interface AnalysisChartProps extends CommonLineChartProps {
  timeSeriesData: object[];
  dates: string[];
}

export interface AnalysisChartRef {
  instanceRef: React.MutableRefObject<ChartWrapperRef | null>;
  saveAsImage: (name?: string) => Promise<void>;
}

// const syncId = 'analysis';

export default React.forwardRef<AnalysisChartRef, AnalysisChartProps>(
  function AnalysisChart(props, ref) {
    const { timeSeriesData, dates, uniqueKeys, dateFormat, xKey, altTitle } =
      props;

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

    useImperativeHandle(
      ref,
      () => ({
        instanceRef: chartRef,
        saveAsImage: async (name = 'chart') => {
          if (!chartRef.current) return;

          const chartImageUrl = await exportImage({
            title: altTitle,
            svgWrapperRef: chartRef,
            legendSvgString: getLegendStringForScreenshot({
              uniqueKeys,
              lineColors: props.colors
            })
          });
          FileSaver.saveAs(chartImageUrl, `${name}.png`);
        }
      }),
      [uniqueKeys, props.colors, altTitle]
    );

    return (
      <Wrapper>
        <Chart
          {...props}
          ref={chartRef}
          // syncId={syncId}
          chartData={chartData}
          renderLegend={false}
          renderBrush={true}
        />
      </Wrapper>
    );
  }
);
