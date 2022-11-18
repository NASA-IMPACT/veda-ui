import React, {
  useCallback,
  useRef,
  useMemo,
  useState,
  MouseEvent
} from 'react';
import { format } from 'date-fns';
import { reverse } from 'd3';
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
import { Dropdown, DropMenu, DropTitle } from '@devseed-ui/dropdown';

import { TimeseriesData } from './timeseries-data';
import {
  ChartCardAlert,
  ChartCardNoData,
  ChartCardNoMetric
} from './chart-card-message';
import { DataMetric } from './analysis-head-actions';
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
import { exportCsv } from '$components/common/chart/analysis/utils';
import DropMenuItemButton from '$styles/drop-menu-item-button';

interface ChartCardProps {
  title: React.ReactNode;
  chartData: TimeseriesData;
  activeMetrics: DataMetric[];
  activeBrushDates: object;
  setActiveBrushDates: (dates: { start: number; end: number }) => void;
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

export default function ChartCard(props: ChartCardProps) {
  const { title, chartData, activeMetrics, activeBrushDates, setActiveBrushDates } = props;
  const { status, meta, data, error, name, id } = chartData;

  const chartRef = useRef<AnalysisChartRef>(null);
  // Capture the brush changes to be able to get the correct dates for the
  // export filename.
  const [brushIndex, setBrushIndex] = useState({ startIndex: 0, endIndex: 0 });
  const noDownloadReason = getNoDownloadReason(chartData);

  // The indexes expect the data to be ascending, so we have to reverse the
  // data.
  const dataInAscOrder = useMemo(() => {
    if (!chartData.data?.timeseries.length) {
      return;
    }
    return reverse(chartData.data.timeseries);
  },[chartData.data]);
  
  const onBrushChange = useCallback((newIndex) => {
    if(!dataInAscOrder) return;
    setActiveBrushDates({
        start: new Date(dataInAscOrder[newIndex.startIndex].date).getTime(),
        end: new Date(dataInAscOrder[newIndex.endIndex].date).getTime()
      });
  },[dataInAscOrder,setActiveBrushDates]);

  const onExportClick = useCallback(
    (e: MouseEvent, type: 'image' | 'text') => {
      e.preventDefault();
      if (!dataInAscOrder) {
        return;
      }
      const { startIndex, endIndex } = brushIndex;

      const data = dataInAscOrder;//reverse(chartData.data.timeseries);
      const dFormat = 'yyyy-MM-dd';
      const startDate = format(new Date(data[startIndex].date), dFormat);
      const endDate = format(new Date(data[endIndex].date), dFormat);

      const filename = `chart.${id}.${startDate}-${endDate}`;

      if (type === 'image') {
        chartRef.current?.saveAsImage(filename);
      } else {
        exportCsv(
          filename,
          data,
          data[startIndex].date,
          data[endIndex].date,
          activeMetrics
        );
      }
    },
    [id, dataInAscOrder, brushIndex, activeMetrics]
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
      data?.timeseries.map((e) => dateFormatter(new Date(e.date), '%Y/%m')) ??
      [],
    [data?.timeseries]
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
            !activeMetrics.length ? (
              <ChartCardNoMetric />
            ) : (
              <Chart
                id={id}
                activeStartDate={activeBrushDates.start}
                activeEndDate={activeBrushDates.end}
                ref={chartRef}
                timeSeriesData={data.timeseries}
                uniqueKeys={uniqueKeys}
                colors={colors}
                xKey='date'
                dates={chartDates}
                dateFormat='%Y/%m'
                altTitle={`Amount of ${name} over time`}
                altDesc={`Amount of ${name} over time`}
                xAxisLabel='Time'
                yAxisLabel='Amount'
                setLocalBrushIndex={setBrushIndex}
                onBrushChange={onBrushChange}
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
