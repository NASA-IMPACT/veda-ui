import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';

import timeSeriesData345 from './sample-timeseries-data-345.json';
import timeSeriesData234 from './sample-timeseries-data-234.json';
import Chart from '$components/common/chart/analysis/';
import { AnalysisLegendComponent } from '$components/common/chart/analysis/control';
import { getColors, dateFormatter } from '$components/common/chart/utils';

import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import Constrainer from '$styles/constrainer';
import { utcString2userTzDate } from '$utils/date';
import { PageMainContent } from '$styles/page';
import Hug from '$styles/hug';

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
  min-height: 600px;
`;
const MainPanel = styled.div`
  width: 100%;
  position: relative;
  grid-column: 1 / -1;
  background-color: lightgrey;
  margin-bottom: 50px;
  padding: 20px;
`;

// manually collected data from the endpoint below for testing purpose. date ranges from 202203 to 202205
// https://staging-raster.delta-backend.com/cog/statistics?url="s3://veda-data-store-staging/geoglam/CropMonitor_${date}.tif"1

const dataForChart1 = {
  timeSeriesData: timeSeriesData345.timeseries,
  dates: timeSeriesData345.timeseries.map((e) =>
    dateFormatter(utcString2userTzDate(e.date), '%Y/%m')
  ),
  uniqueKeys: [
    { label: 'Min', value: 'min', active: true },
    { label: 'Max', value: 'max', active: true },
    { label: 'STD', value: 'std', active: true }
  ],
  dateFormat: '%Y/%m',
  xKey: 'date'
};

const dataForChart2 = {
  timeSeriesData: timeSeriesData234.timeseries,
  dates: timeSeriesData234.timeseries.map((e) =>
    dateFormatter(utcString2userTzDate(e.date), '%Y/%m')
  ),
  uniqueKeys: [
    { label: 'Min', value: 'min', active: true },
    { label: 'Max', value: 'max', active: true },
    { label: 'STD', value: 'std', active: true }
  ],
  dateFormat: '%Y/%m',
  xKey: 'date'
};

export default function AnalysisChart() {
  const legendColors = getColors({ steps: dataForChart1.uniqueKeys.length });

  const [dynamicUniqueKeys, setDynamicUniqueKeys] = useState(
    dataForChart1.uniqueKeys
  );
  const [activeBrushDates, setActiveBrushDates] = useState({
    start: 0,
    end: 0
  });

  function onBrushChange(newIndex, data) {
    console.log(newIndex);
    setActiveBrushDates({
      start: new Date(data.timeSeriesData[newIndex.startIndex].date).getTime(),
      end: new Date(data.timeSeriesData[newIndex.endIndex].date).getTime()
    });
  }

  function onLegendClick(e) {
    const newobj = dynamicUniqueKeys.map((key) => {
      if (key.value === e) {
        return {
          ...key,
          active: !key.active
        };
      } else return key;
    });

    setDynamicUniqueKeys(newobj);
  }

  const chartRef = useRef();

  const onExportClick = useCallback(() => {
    chartRef.current?.saveAsImage('test-chart.jpg');
  }, []);

  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <Fold>
            <FoldHeader>
              <FoldTitle>Chart on analysis page</FoldTitle>
            </FoldHeader>
          </Fold>
          <Hug>
            <Hug
              grid={{
                smallUp: ['content-start', 'content-end'],
                largeUp: ['content-start', 'content-end']
              }}
            >
              <MainPanel>
                <AnalysisLegendComponent
                  payload={dynamicUniqueKeys.map((e, idx) => ({
                    ...e,
                    color: legendColors[idx],
                    onClick: onLegendClick
                  }))}
                  width='500px'
                />
              </MainPanel>
            </Hug>
          </Hug>
          <Hug>
            {JSON.stringify(activeBrushDates)}
            <Hug
              grid={{
                smallUp: ['full-start', 'full-end'],
                largeUp: ['content-start', 'content-7']
              }}
            >
              <Button onClick={onExportClick} variation='primary-fill'>
                Export
              </Button>
              <Chart
                ref={chartRef}
                id='chart1'
                activeStartDate={activeBrushDates.start}
                activeEndDate={activeBrushDates.end}
                colors={['red', 'blue', 'green']}
                timeSeriesData={dataForChart1.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
                xKey={dataForChart1.xKey}
                dates={dataForChart1.dates}
                dateFormat={dataForChart1.dateFormat}
                altTitle='alt title1'
                altDesc='alt desc'
                xAxisLabel='x axis label'
                yAxisLabel='y axis label'
                onBrushChange={(newIndex) => {
                  onBrushChange(newIndex, dataForChart1);
                }}
              />
            </Hug>
          </Hug>
          <Hug>
            <Hug
              grid={{
                smallUp: ['full-start', 'full-end'],
                largeUp: ['content-7', 'content-end']
              }}
            >
              <Chart
                id='chart4'
                activeStartDate={activeBrushDates.start}
                activeEndDate={activeBrushDates.end}
                timeSeriesData={dataForChart1.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
                xKey={dataForChart1.xKey}
                dates={dataForChart1.dates}
                dateFormat={dataForChart1.dateFormat}
                altTitle='alt title4'
                altDesc='alt desc'
                xAxisLabel='x axis label'
                yAxisLabel='y axis label'
                onBrushChange={(newIndex) => {
                  onBrushChange(newIndex, dataForChart1);
                }}
              />
            </Hug>
          </Hug>
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}
