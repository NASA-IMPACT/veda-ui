import React from 'react';
import styled from 'styled-components';

import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';
import TimeseriesControl from '$components/datasets/s-explore/timeseries';
import { prepareDates } from '$components/datasets/s-explore/timeseries/utils';

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
`;

const Box = styled.div`
  max-width: 30rem;
  margin: 3rem auto;
`;

const dates = [
  new Date('2021-01-01'),
  new Date('2022-01-01'),
  new Date('2022-02-01'),
  new Date('2022-03-01'),
  new Date('2022-05-01'),
  new Date('2022-06-01'),
  new Date('2022-07-01'),
  new Date('2022-08-01'),
  new Date('2022-09-01'),
  new Date('2022-10-01'),
  new Date('2022-11-01'),
  new Date('2022-12-01'),
  new Date('2023-05-01')
];
const readyDatesD = prepareDates(dates, 'day');
const readyDatesM = prepareDates(dates, 'month');
const readyDatesY = prepareDates(dates, 'year');

function SandboxTimeseries() {
  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <Box>
            <h2>Month</h2>
            <TimeseriesControl data={readyDatesM} timeUnit='month' />
          </Box>
          <Box>
            <h2>Year</h2>
            <TimeseriesControl data={readyDatesY} timeUnit='year' />
          </Box>
          <Box>
            <h2>Day</h2>
            <TimeseriesControl data={readyDatesD} timeUnit='day' />
          </Box>
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxTimeseries;
