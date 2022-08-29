import React, { useState } from 'react';
import styled from 'styled-components';
import { DatePicker } from '@devseed-ui/date-picker';

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
  const [activeDate, setActiveDate] = useState({
    start: dates[0],
    end: dates[0]
  });

  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <DatePicker
            id='date-picker'
            alignment='left'
            direction='down'
            view='month'
            max={dates.last}
            min={dates[0]}
            datesToRestrict={dates}
            restrictMode='enable'
            onConfirm={setActiveDate}
            value={activeDate}
            isClearable
          />
          <Box>
            <h2>Month</h2>
            <TimeseriesControl
              data={readyDatesM}
              value={activeDate.start}
              timeUnit='month'
            />
          </Box>
          <Box>
            <h2>Year</h2>
            <TimeseriesControl
              data={readyDatesY}
              value={activeDate.start}
              timeUnit='year'
            />
          </Box>
          <Box>
            <h2>Day</h2>
            <TimeseriesControl
              data={readyDatesD}
              value={activeDate.start}
              timeUnit='day'
            />
          </Box>
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxTimeseries;
