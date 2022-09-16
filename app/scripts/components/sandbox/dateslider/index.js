import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { DatePicker } from '@devseed-ui/date-picker';
import { Button } from '@devseed-ui/button';
import {
  CollecticonChevronLeftSmall,
  CollecticonChevronRightSmall
} from '@devseed-ui/collecticons';

import Constrainer from '$styles/constrainer';
import { mod } from '$utils/utils';
import { PageMainContent } from '$styles/page';
import DateSliderControl from '$components/common/dateslider';
import { prepareDates } from '$components/common/dateslider/utils';

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

  const navigateDate = (modifier = 1) => {
    const idx = dates.findIndex(
      (d) => format(d, 'yyyy-MM-dd') === format(activeDate.start, 'yyyy-MM-dd')
    );
    const nDate = dates[mod(idx + modifier, dates.length)];
    setActiveDate({
      start: nDate,
      end: nDate
    });
  };

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
          <Button
            onClick={() => {
              navigateDate(-1);
            }}
          >
            <CollecticonChevronLeftSmall />
          </Button>
          <Button
            onClick={() => {
              navigateDate();
            }}
          >
            <CollecticonChevronRightSmall />
          </Button>
          <Box>
            <h2>Month</h2>
            <DateSliderControl
              data={readyDatesM}
              value={activeDate.start}
              timeDensity='month'
              onChange={({ date }) => setActiveDate({ start: date, end: date })}
            />
          </Box>
          <Box>
            <h2>Year</h2>
            <DateSliderControl
              data={readyDatesY}
              value={activeDate.start}
              timeDensity='year'
              onChange={({ date }) => setActiveDate({ start: date, end: date })}
            />
          </Box>
          <Box>
            <h2>Day</h2>
            <DateSliderControl
              data={readyDatesD}
              value={activeDate.start}
              timeDensity='day'
              onChange={({ date }) => setActiveDate({ start: date, end: date })}
            />
          </Box>
          <Box>
            <h2>Single</h2>
            <DateSliderControl
              data={[readyDatesY[0]]}
              value={readyDatesY[0].date}
              timeDensity='year'
              onChange={() => {
                /* no-op */
              }}
            />
          </Box>
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxTimeseries;
