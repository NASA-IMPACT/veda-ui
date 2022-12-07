import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';

import dataDaily from './sample-daily.json';
import dataMonthly from './sample-monthly.json';
import dataYearly from './sample-yearly.json';
import dataYearly2 from './sample-yearly2.json';

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

function makeData(data, dateFormat) {
  return {
    timeSeriesData: data,
    dates: data.map((e) =>
      dateFormatter(utcString2userTzDate(e.date), dateFormat)
    ),
    uniqueKeys: [
      { label: 'Min', value: 'min', active: true },
      { label: 'Max', value: 'max', active: true },
      { label: 'STD', value: 'std', active: true }
    ],
    dateFormat: dateFormat
  };
}

const dailyChartData = makeData(dataDaily, '%Y/%m/%d');
const monthlyChartData = makeData(dataMonthly, '%Y/%m');
const yearlyChartData = makeData(dataYearly, '%Y');
const yearly2ChartData = makeData(dataYearly2, '%Y');

// Simple wrapper to handle brush state. Can also be syncronized across all chart components
function ChartWrapper(props) {
  const availableDomain = useMemo(
    () => [
      new Date(props.timeSeriesData[0].date),
      new Date(props.timeSeriesData[props.timeSeriesData.length - 1].date)
    ],
    [props.timeSeriesData]
  );

  const [brushRange, setBrushRange] = useState(null);

  useEffect(() => {
    if (availableDomain && !brushRange) {
      setBrushRange(availableDomain);
    }
  }, [availableDomain, brushRange, setBrushRange]);

  if (!brushRange) return null;
  return (
    <Chart
      {...props}
      availableDomain={availableDomain}
      brushRange={brushRange}
      onBrushRangeChange={(range) => setBrushRange(range)}
    />
  );
}

ChartWrapper.propTypes = {
  timeSeriesData: T.array.isRequired
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
              <h2>Daily</h2>
              <Button onClick={onExportClick} variation='primary-fill'>
                Export
              </Button>
              <ChartWrapper
                ref={chartRef}
                colors={legendColors}
                timeSeriesData={dailyChartData.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
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
              <h2>Monthly</h2>
              <ChartWrapper
                colors={legendColors}
                timeSeriesData={monthlyChartData.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
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
              <h2>Yearly</h2>
              <ChartWrapper
                colors={legendColors}
                timeSeriesData={yearlyChartData.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
                dates={yearlyChartData.dates}
                dateFormat={yearlyChartData.dateFormat}
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
              <h2>Yearly 2</h2>
              <ChartWrapper
                colors={legendColors}
                timeSeriesData={yearly2ChartData.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
                dates={yearly2ChartData.dates}
                dateFormat={yearly2ChartData.dateFormat}
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
