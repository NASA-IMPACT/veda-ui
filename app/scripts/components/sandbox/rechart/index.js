import React, { useState } from 'react';
import styled from 'styled-components';
import Chart from '$components/common/rechart-chart/';

import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
  min-height: 400px;
`;

function Rechart() {
  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <Chart
            dataPath={
              new URL('../../sandbox/mdx-chart/aq.csv', import.meta.url)
            }
            xKey='Year'
            idKey='Data Type'
            dateFormat='%Y'
            yKey='United States Change from 2005'
            colors={['red', 'grey']}
            xAxisLabel='x axis label'
            yAxisLabel='y axis label'
          />
          <Chart
            dataPath='/public/example.csv'
            dateFormat='%m/%d/%Y'
            idKey='County'
            xKey='Test Date'
            yKey='New Positives'
            highlightStart='03/10/2020'
            highlightEnd='05/01/2020'
            highlightLabel='Omicron'
          />
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default Rechart;
