import React, { useState } from 'react';
import styled from 'styled-components';
import Chart from '$components/common/rechart-chart/block';
import { Fold, FoldProse } from '$components/common/fold';
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
          <Fold>
            <FoldProse>
              <h2> Chart for MDX </h2>
            </FoldProse>
          </Fold>
          <Chart
            dataPath={
              new URL('../../sandbox/mdx-chart/aq.csv', import.meta.url)
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
          <Chart
            dataPath='/public/example.csv'
            dateFormat='%m/%d/%Y'
            idKey='County'
            xKey='Year'
            yKey='New Positives'
            altTitle='covid case in Kings county'
            altDesc='peak in omicron'
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
