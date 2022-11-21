import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';

import dataDaily from './sample-daily.json';
import dataMonthly from './sample-monthly.json';
import dataYearly from './sample-yearly.json';

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

const dailyChartData = {
  timeSeriesData: dataDaily,
  dates: dataDaily.map((e) =>
    dateFormatter(utcString2userTzDate(e.date), '%Y/%m/%d')
  ),
  uniqueKeys: [
    { label: 'Min', value: 'min', active: true },
    { label: 'Max', value: 'max', active: true },
    { label: 'STD', value: 'std', active: true }
  ],
  dateFormat: '%Y/%m/%d',
  xKey: 'date'
};

const monthlyChartData = {
  timeSeriesData: dataMonthly,
  dates: dataMonthly.map((e) =>
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

const yearlyChartData = {
  timeSeriesData: dataYearly,
  dates: dataYearly.map((e) =>
    dateFormatter(utcString2userTzDate(e.date), '%Y')
  ),
  uniqueKeys: [
    { label: 'Min', value: 'min', active: true },
    { label: 'Max', value: 'max', active: true },
    { label: 'STD', value: 'std', active: true }
  ],
  dateFormat: '%Y',
  xKey: 'date'
};

export default function AnalysisChart() {
  const legendColors = getColors({ steps: dailyChartData.uniqueKeys.length });

  const [dynamicUniqueKeys, setDynamicUniqueKeys] = useState(
    dailyChartData.uniqueKeys
  );

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
                colors={legendColors}
                timeSeriesData={dailyChartData.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
                xKey={dailyChartData.xKey}
                dates={dailyChartData.dates}
                dateFormat={dailyChartData.dateFormat}
                altTitle='alt title1'
                altDesc='alt desc'
                xAxisLabel='Time'
                yAxisLabel='Amount'
              />
            </Hug>
            <Hug
              grid={{
                smallUp: ['full-start', 'full-end'],
                largeUp: ['content-7', 'content-end']
              }}
            >
              <Chart
                colors={legendColors}
                timeSeriesData={monthlyChartData.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
                xKey={monthlyChartData.xKey}
                dates={monthlyChartData.dates}
                dateFormat={monthlyChartData.dateFormat}
                altTitle='alt title1'
                altDesc='alt desc'
                xAxisLabel='Time'
                yAxisLabel='Amount'
              />
            </Hug>
          </Hug>
          <Hug>
            <Hug
              grid={{
                smallUp: ['full-start', 'full-end'],
                largeUp: ['content-start', 'content-7']
              }}
            >
              <Chart
                colors={legendColors}
                timeSeriesData={yearlyChartData.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
                xKey={yearlyChartData.xKey}
                dates={yearlyChartData.dates}
                dateFormat={yearlyChartData.dateFormat}
                altTitle='alt title1'
                altDesc='alt desc'
                xAxisLabel='Time'
                yAxisLabel='Amount'
              />
            </Hug>
          </Hug>
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}
