import React, {
  useCallback,
  useRef,
  useMemo,
  MouseEvent,
  ReactNode,
  useState
} from 'react';
import { DatasetLayer } from 'veda';
import { reverse } from 'd3';
import styled, { useTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { glsp } from '@devseed-ui/theme-provider';
import {
  Toolbar,
  ToolbarIconButton,
  VerticalDivider
} from '@devseed-ui/toolbar';
import {
  CollecticonCircleInformation,
  CollecticonDownload2,
  CollecticonExpandTopRight
} from '@devseed-ui/collecticons';
import { Dropdown, DropMenu, DropTitle } from '@devseed-ui/dropdown';
import { Button } from '@devseed-ui/button';

import { getDateRangeFormatted } from '../utils';
import { TimeseriesData } from './timeseries-data';
import {
  ChartCardAlert,
  ChartCardNoData,
  ChartCardNoMetric
} from './chart-card-message';
import AnalysisMetricsDropdown, {
  DataMetric,
  DATA_METRICS
} from './analysis-metrics-dropdown';

import {
  CardSelf,
  CardHeader,
  CardHeadline,
  CardTitle,
  CardActions,
  CardBody
} from '$components/common/card';
import Chart, { AnalysisChartRef } from '$components/common/chart/analysis';
import { ChartLoading } from '$components/common/loading-skeleton';
import { dateFormatter } from '$components/common/chart/utils';
import { Tip } from '$components/common/tip';
import { composeVisuallyDisabled } from '$utils/utils';
import {
  exportCsv,
  getTimeDensityFormat
} from '$components/common/chart/analysis/utils';
import DropMenuItemButton from '$styles/drop-menu-item-button';
import { getDatasetPath } from '$utils/routes';
import { allDatasetsProps } from '$utils/veda-data';

const InfoTipContent = styled.div`
  padding: ${glsp(0.25)};
  display: flex;
  flex-flow: column;
  gap: ${glsp(0.5)};

  ${Button} {
    align-self: flex-start;
  }
`;

function getInitialMetrics(data: DatasetLayer): DataMetric[] {
  const metricsIds = data.analysis?.metrics ?? [];

  const foundMetrics = metricsIds
    .map((metric: string) => {
      return DATA_METRICS.find((m) => m.id === metric)!;
    })
    .filter(Boolean);

  if (!foundMetrics.length) {
    return DATA_METRICS;
  }

  return foundMetrics;
}

interface ChartCardProps {
  title: ReactNode;
  chartData: TimeseriesData;
  availableDomain: [Date, Date];
  brushRange: [Date, Date];
  onBrushRangeChange: (range: [Date, Date]) => void;
}

const ChartDownloadButton = composeVisuallyDisabled(ToolbarIconButton);

const getNoDownloadReason = ({ status, data }: TimeseriesData) => {
  if (status === 'errored') {
    return 'Data loading errored. Download is not available.';
  }
  if (status === 'loading') {
    return 'Download will be available once the data finishes loading.';
  }
  if (!data.timeseries.length) {
    return 'There is no data to download.';
  }
  return '';
};

/**
 * Get the Dataset overview path from a given dataset layer.
 *
 * The analysis charts refer to a dataset layer and not the dataset itself.
 * Since each dataset layer is analyzed individually (relating to a STAC
 * dataset), there is no information on the layer data about the parent dataset.
 * To find the corresponding dataset we look through the layers of the datasets
 * use the found match.
 *
 * @param layerId Id of the dataset layer
 *
 * @returns Internal path for Link
 */
const getDatasetOverviewPath = (layerId: string) => {
  const dataset = allDatasetsProps.find((d) =>
    d.layers.find((l) => l.id === layerId)
  );

  return dataset ? getDatasetPath(dataset) : '/';
};

export default function ChartCard(props: ChartCardProps) {
  const { title, chartData, availableDomain, brushRange, onBrushRangeChange } =
    props;
  const { status, meta, data, error, name, id, layer } = chartData;

  const [activeMetrics, setActiveMetrics] = useState<DataMetric[]>(
    getInitialMetrics(layer)
  );

  const chartRef = useRef<AnalysisChartRef>(null);
  const noDownloadReason = getNoDownloadReason(chartData);

  const timeDensityFormat = getTimeDensityFormat(data?.timeDensity);

  const onExportClick = useCallback(
    (e: MouseEvent, type: 'image' | 'text') => {
      e.preventDefault();
      if (!chartData.data?.timeseries.length) {
        return;
      }

      const [startDate, endDate] = brushRange;
      // The indexes expect the data to be ascending, so we have to reverse the
      // data.
      const data = reverse(chartData.data.timeseries);
      const filename = `chart.${id}.${getDateRangeFormatted(
        startDate,
        endDate
      )}`;

      if (type === 'image') {
        chartRef.current?.saveAsImage(filename);
      } else {
        exportCsv(filename, data, startDate, endDate, activeMetrics);
      }
    },
    [id, chartData.data, brushRange, activeMetrics]
  );

  const theme = useTheme();

  const { uniqueKeys, colors } = useMemo(() => {
    return {
      uniqueKeys: activeMetrics.map((metric) => ({
        label: metric.chartLabel,
        value: metric.id,
        active: true
      })),
      colors: activeMetrics.map((metric) => theme.color?.[metric.themeColor])
    };
  }, [activeMetrics, theme]);

  const chartDates = useMemo(
    () =>
      data?.timeseries.map((e) =>
        dateFormatter(new Date(e.date), timeDensityFormat)
      ) ?? [],
    [data?.timeseries, timeDensityFormat]
  );

  return (
    <CardSelf>
      <CardHeader>
        <CardHeadline>
          <CardTitle>{title}</CardTitle>
        </CardHeadline>
        <CardActions>
          <Toolbar size='small'>
            <Dropdown
              alignment='right'
              triggerElement={(props) => (
                <Tip
                  content={noDownloadReason}
                  disabled={!noDownloadReason}
                  hideOnClick={false}
                >
                  <ChartDownloadButton
                    {...props}
                    variation='base-text'
                    visuallyDisabled={!!noDownloadReason}
                  >
                    <CollecticonDownload2 title='Download' meaningful />
                  </ChartDownloadButton>
                </Tip>
              )}
            >
              <DropTitle>Select a file format</DropTitle>
              <DropMenu>
                <li>
                  <DropMenuItemButton
                    onClick={(e) => onExportClick(e, 'image')}
                  >
                    Image (PNG)
                  </DropMenuItemButton>
                </li>
                <li>
                  <DropMenuItemButton onClick={(e) => onExportClick(e, 'text')}>
                    Text (CSV)
                  </DropMenuItemButton>
                </li>
              </DropMenu>
            </Dropdown>
            <AnalysisMetricsDropdown
              isDisabled={status !== 'succeeded'}
              activeMetrics={activeMetrics}
              onMetricsChange={setActiveMetrics}
            />
            <VerticalDivider variation='dark' />
            <Tip
              content={
                <InfoTipContent>
                  <p>{layer.description}</p>
                  <Button
                    forwardedAs={Link}
                    to={getDatasetOverviewPath(layer.id)}
                    target='_blank'
                    variation='achromic-outline'
                    size='small'
                  >
                    View dataset <CollecticonExpandTopRight />
                  </Button>
                </InfoTipContent>
              }
              trigger='click'
              interactive
            >
              <ToolbarIconButton variation='base-text'>
                <CollecticonCircleInformation title='More info' meaningful />
              </ToolbarIconButton>
            </Tip>
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
            !activeMetrics.length ? (
              <ChartCardNoMetric />
            ) : (
              <Chart
                ref={chartRef}
                timeSeriesData={data.timeseries}
                uniqueKeys={uniqueKeys}
                colors={colors}
                dates={chartDates}
                dateFormat={timeDensityFormat}
                altTitle={`Amount of ${name} over time`}
                altDesc={`Amount of ${name} over time`}
                xAxisLabel='Time'
                yAxisLabel={layer.legend?.unit?.label ?? 'Amount'}
                availableDomain={availableDomain}
                brushRange={brushRange}
                onBrushRangeChange={onBrushRangeChange}
              />
            )
          ) : (
            <ChartCardNoData />
          )
        ) : null}
      </CardBody>
    </CardSelf>
  );
}
