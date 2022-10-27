import React, { useEffect, useMemo, useState } from 'react';
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

interface ChartCardProps {
  title: React.ReactNode;
  chartData: TimeseriesData;
}

export default function ChartCard(props: ChartCardProps) {
  const { title, chartData } = props;
  const { status, meta, data, error } = chartData;

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
            <p>Ready to show data</p>
          ) : (
            <ChartCardNoData />
          )
        ) : null}
      </CardBody>
    </CardSelf>
  );
}
