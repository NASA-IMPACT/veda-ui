import React, { useMemo } from 'react';
import { useTheme } from 'styled-components';
import {
  Toolbar,
  ToolbarIconButton,
  VerticalDivider
} from '@devseed-ui/toolbar';
import {
  CollecticonCircleInformation,
  CollecticonDownload2
} from '@devseed-ui/collecticons';

import {
  CardSelf,
  CardHeader,
  CardHeadline,
  CardTitle,
  CardActions,
  CardBody
} from '$components/common/card';
import { TimeseriesData } from './timeseries-data';
import { ChartLoading } from '$components/common/loading-skeleton';
import { ChartCardAlert, ChartCardNoData } from './chart-card-message';
import Chart from '$components/common/chart/analysis';
import { dateFormatter } from '$components/common/chart/utils';
import { DataMetric } from './analysis-head-actions';

interface ChartCardProps {
  title: React.ReactNode;
  chartData: TimeseriesData;
  activeMetrics: DataMetric[];
}

export default function ChartCard(props: ChartCardProps) {
  const { title, chartData, activeMetrics } = props;
  const { status, meta, data, error, name } = chartData;

  const theme = useTheme();

  const { uniqueKeys, colors } = useMemo(() => {
    return {
      uniqueKeys: activeMetrics.map((metric) => ({
        label: metric.chartLabel,
        value: metric.id,
        active: true
      })),
      colors: activeMetrics.map((metric) => theme.color[metric.themeColor])
    };
  }, [activeMetrics, theme]);

  return (
    <CardSelf>
      <CardHeader>
        <CardHeadline>
          <CardTitle>{title}</CardTitle>
        </CardHeadline>
        <CardActions>
          <Toolbar size='small'>
            <ToolbarIconButton variation='base-text'>
              <CollecticonDownload2 title='Download' meaningful />
            </ToolbarIconButton>
            <VerticalDivider variation='dark' />
            <ToolbarIconButton variation='base-text'>
              <CollecticonCircleInformation title='More info' meaningful />
            </ToolbarIconButton>
          </Toolbar>
        </CardActions>
      </CardHeader>
      <CardBody>
        {status === 'errored' && <ChartCardAlert message={error.message} />}

        {status === 'loading' ? (
          meta.total ? (
            <ChartLoading message={`${meta.loaded} of ${meta.total} loaded.`} />
          ) : (
            <ChartLoading message='Loading...' />
          )
        ) : null}

        {status === 'succeeded' ? (
          data.timeseries.length ? (
            <Chart
              timeSeriesData={data.timeseries}
              uniqueKeys={uniqueKeys}
              colors={colors}
              xKey='date'
              dates={data.timeseries.map((e) =>
                dateFormatter(new Date(e.date), '%Y/%m')
              )}
              dateFormat='%Y/%m'
              altTitle={`Amount of ${name} over time`}
              altDesc={`Amount of ${name} over time`}
              xAxisLabel='Time'
              yAxisLabel='Amount'
            />
          ) : (
            <ChartCardNoData />
          )
        ) : null}
      </CardBody>
    </CardSelf>
  );
}
