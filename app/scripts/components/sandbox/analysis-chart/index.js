import React from 'react';
import styled from 'styled-components';
import Chart from '$components/common/chart/block';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';
import Hug from '$styles/hug';

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
  min-height: 600px;
`;

function Rechart() {
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
                dataPath={
                  new URL('../../sandbox/mdx-chart/aq.csv', import.meta.url)
                    .href
                }
                xKey='Year'
                idKey='Data Type'
                dateFormat='%Y'
                yKey='United States Change from 2005'
                altTitle='no2 and so2'
                altDesc='no2 and so2 has decreased'
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
                dataPath='/public/example.csv'
                dateFormat='%m/%d/%Y'
                idKey='County'
                xKey='Test Date'
                yKey='New Positives'
                altTitle='covid case in Kings county'
                altDesc='peak in omicron'
                highlightStart='03/10/2020'
                highlightEnd='05/01/2020'
                highlightLabel='Omicron'
              />
            </Hug>
          </Hug>
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default Rechart;
