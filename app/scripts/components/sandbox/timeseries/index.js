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
  new Date('2022-12-01')
];
const readyDates = prepareDates(dates, 'month');

function SandboxTimeseries() {
  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <Box>
            <TimeseriesControl data={readyDates} />
          </Box>
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxTimeseries;
