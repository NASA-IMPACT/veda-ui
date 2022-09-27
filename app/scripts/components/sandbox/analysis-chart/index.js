import React, { useState } from 'react';
import styled from 'styled-components';
import Chart from '$components/common/chart/analysis/';
import { AnalysisLegendComponent } from '$components/common/chart/analysis/control';
import { getColors } from '$components/common/chart/utils';

import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';
import Hug from '$styles/hug';

import timeSeriesData345 from './sample-timeseries-data-345.json';
import timeSeriesData234 from './sample-timeseries-data-234.json';

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
  timeSeriesData: timeSeriesData345,
  dates: ['2022/03', '2022/04', '2022/05'],
  uniqueKeys: [
    { label: 'Min', value: 'min', active: true },
    { label: 'Max', value: 'max', active: true },
    { label: 'STD', value: 'std', active: true }
  ],
  dateFormat: '%Y/%m',
  xKey: 'Date'
};

const dataForChart2 = {
  timeSeriesData: timeSeriesData234,
  dates: [
    '2021/10',
    '2021/11',
    '2022/01',
    '2022/02',
    '2022/03',
    '2022/04',
    '2022/05'
  ],
  uniqueKeys: [
    { label: 'Min', value: 'min', active: true },
    { label: 'Max', value: 'max', active: true },
    { label: 'STD', value: 'std', active: true }
  ],
  dateFormat: '%Y/%m',
  xKey: 'Date'
};

export default function AnalysisChart() {
  const legendColors = getColors({ steps: dataForChart1.uniqueKeys.length });

  const [dynamicUniqueKeys, setDynamicUniqueKeys] = useState(
    dataForChart1.uniqueKeys
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
              <Chart
                timeSeriesData={dataForChart1.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
                xKey={dataForChart1.xKey}
                dates={dataForChart1.dates}
                dateFormat={dataForChart1.dateFormat}
                altTitle='alt title'
                altDesc='alt desc'
                xAxisLabel='x axis label'
                yAxisLabel='y axis label'
              />
            </Hug>
            <Hug
              grid={{
                smallUp: ['full-start', 'full-end'],
                largeUp: ['content-7', 'content-end']
              }}
            >
              <Chart
                timeSeriesData={dataForChart2.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
                xKey={dataForChart2.xKey}
                dates={dataForChart2.dates}
                dateFormat={dataForChart2.dateFormat}
                altTitle='alt title'
                altDesc='alt desc'
                xAxisLabel='x axis label'
                yAxisLabel='y axis label'
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
                timeSeriesData={dataForChart1.timeSeriesData}
                uniqueKeys={dynamicUniqueKeys}
                xKey={dataForChart1.xKey}
                dates={['2020', '2021', '2022']}
                dateFormat='%Y'
                altTitle='alt title'
                altDesc='alt desc'
                xAxisLabel='x axis label'
                yAxisLabel='y axis label'
              />
            </Hug>
          </Hug>
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}
