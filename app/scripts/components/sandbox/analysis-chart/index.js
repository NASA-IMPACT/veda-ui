import React, { useEffect } from 'react';
import styled from 'styled-components';
import Chart from '$components/common/chart/analysis';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';
import Hug from '$styles/hug';
import timeSeriesData from './sample-timeseries-data.json';

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
  min-height: 600px;
`;

// manually aggregated data from the endpoint below for testing purpose. date ranges from 202203 to 202205
// https://staging-raster.delta-backend.com/cog/statistics?url="s3://veda-data-store-staging/geoglam/CropMonitor_${date}.tif"1

export default function AnalysisChart() {
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
                smallUp: ['full-start', 'full-end'],
                largeUp: ['content-start', 'content-7']
              }}
            >
              <Chart
                chartData={timeSeriesData}
                uniqueKeys={['min', 'max', 'std']}
                xKey='Date'
                dates={['202203', '202204', '202205']}
                dateFormat='%Y%m'
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
                chartData={timeSeriesData}
                uniqueKeys={['min', 'max', 'std']}
                xKey='Date'
                dates={['202203', '202204', '202205']}
                dateFormat='%Y%m'
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
