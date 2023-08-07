import React from 'react';
import { eachDayOfInterval } from 'date-fns';
import { useSetAtom } from 'jotai';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';

import { timelineDatasetsAtom } from './atoms';
import { TimelineDataset, TimelineDatasetStatus } from './constants';

const extraDataset = {
  id: 'infinity',
  title: 'Daily infinity!',
  timeDensity: 'day',
  domain: eachDayOfInterval({
    start: new Date('2000-01-01'),
    end: new Date('2021-12-12')
  })
};

const dataset2Months = {
  id: 'two-dates',
  title: 'Two Dates',
  timeDensity: 'month',
  domain: [new Date('2020-01-01'), new Date('2020-02-01')]
};

const dataset2Days = {
  id: 'two-days',
  title: 'Two Days',
  timeDensity: 'day',
  domain: [new Date('2020-01-05'), new Date('2020-01-06')]
};

const datasetSingle = {
  id: 'single-dates',
  title: 'Single Date',
  timeDensity: 'day',
  domain: [new Date('2020-01-01')]
};

const datasets = [
  {
    id: 'monthly',
    title: 'Monthly dataset',
    timeDensity: 'month',
    domain: [
      new Date('2020-01-01'),
      new Date('2020-02-01'),
      new Date('2020-03-01'),
      new Date('2020-05-01'),
      new Date('2020-06-01')
    ]
  },
  {
    id: 'daily',
    title: 'Daily dataset',
    timeDensity: 'day',
    domain: [
      new Date('2020-01-01'),
      new Date('2020-01-02'),
      new Date('2020-01-03'),
      new Date('2020-01-04'),
      new Date('2020-01-05'),
      new Date('2020-01-07'),
      new Date('2020-01-08'),
      new Date('2020-01-09'),
      new Date('2020-01-10'),
      new Date('2020-01-11'),
      new Date('2020-01-12'),
      new Date('2020-01-13'),
      new Date('2020-01-14'),
      new Date('2020-01-15'),
      new Date('2020-01-16'),
      new Date('2020-01-19'),
      new Date('2020-01-20'),
      new Date('2020-01-21'),
      new Date('2020-01-22'),
      new Date('2020-01-23'),
      new Date('2020-01-24'),
      new Date('2020-01-25'),
      new Date('2020-01-26'),
      new Date('2020-01-27'),
      new Date('2020-01-28'),
      new Date('2020-01-29'),
      new Date('2020-01-30'),
      new Date('2020-01-31'),
      new Date('2020-02-01'),
      new Date('2020-02-02'),
      new Date('2020-02-03'),
      new Date('2020-02-04'),
      new Date('2020-02-05'),
      new Date('2020-02-06'),
      new Date('2020-02-07'),
      new Date('2020-02-08'),
      new Date('2020-02-12'),
      new Date('2020-02-13'),
      new Date('2020-02-14'),
      new Date('2020-02-15'),
      new Date('2020-02-16'),
      new Date('2020-02-17'),
      new Date('2020-02-18'),
      new Date('2020-02-19'),
      new Date('2020-02-20'),
      new Date('2020-02-22'),
      new Date('2020-02-23'),
      new Date('2020-02-24'),
      new Date('2020-02-25'),
      new Date('2020-02-26'),
      new Date('2020-02-27'),
      new Date('2020-02-28'),
      new Date('2020-02-29'),
      new Date('2020-03-01'),
      new Date('2020-03-02'),
      new Date('2020-03-03'),
      new Date('2020-03-04'),
      new Date('2020-03-05'),
      new Date('2020-03-06'),
      new Date('2020-03-07'),
      new Date('2020-03-08')
    ]
  },
  {
    id: 'daily2',
    title: 'Daily 2',
    timeDensity: 'day',
    domain: [
      new Date('2020-01-01'),
      new Date('2020-02-01'),
      new Date('2020-03-01'),
      new Date('2020-05-01'),
      new Date('2020-06-01')
    ]
  },
  {
    id: 'daily3',
    title: 'Daily 3',
    timeDensity: 'day',
    domain: eachDayOfInterval({
      start: new Date('2020-01-01'),
      end: new Date('2021-01-01')
    })
  }
].map((d) => makeDataset(d));

function makeDataset(
  data,
  status = TimelineDatasetStatus.SUCCEEDED,
  settings: Record<string, any> = {}
): TimelineDataset {
  return {
    status,
    data,
    error: null,
    settings: {
      ...settings,
      isVisible: settings.isVisible === undefined ? true : settings.isVisible
    }
  };
}

function toggleDataset(dataset) {
  return (d) => {
    if (d.find((dd) => dd.data.id === dataset.data.id)) {
      return d.filter((dd) => dd.data.id !== dataset.data.id);
    }
    return [...d, dataset];
  };
}

const MockPanel = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 1rem;
  gap: 1rem;
`;

export function MockControls() {
  const set = useSetAtom(timelineDatasetsAtom);

  return (
    <MockPanel>
      <Button onClick={() => set([])} variation='base-outline'>
        Clear
      </Button>
      <Button onClick={() => set(datasets)} variation='base-outline'>
        Base datasets
      </Button>
      <Button
        onClick={() => {
          set(toggleDataset(makeDataset(extraDataset)));
        }}
        variation='base-outline'
      >
        Toggle infinity dataset
      </Button>
      <Button
        onClick={() => {
          set(
            toggleDataset(
              makeDataset(
                {
                  id: 'loading',
                  title: 'Loading dataset'
                },
                TimelineDatasetStatus.LOADING
              )
            )
          );
        }}
        variation='base-outline'
      >
        Toggle Loading dataset
      </Button>
      <Button
        onClick={() => {
          set(
            toggleDataset(
              makeDataset(
                {
                  id: 'errored',
                  title: 'Error dataset'
                },
                TimelineDatasetStatus.ERRORED
              )
            )
          );
        }}
        variation='base-outline'
      >
        Toggle Error dataset
      </Button>
      <Button
        onClick={() => {
          set(toggleDataset(makeDataset(dataset2Months)));
        }}
        variation='base-outline'
      >
        toggle 2 Months dataset
      </Button>
      <Button
        onClick={() => {
          set(toggleDataset(makeDataset(dataset2Days)));
        }}
        variation='base-outline'
      >
        toggle 2 Days dataset
      </Button>
      <Button
        onClick={() => {
          set(toggleDataset(makeDataset(datasetSingle)));
        }}
        variation='base-outline'
      >
        toggle Single dataset
      </Button>
    </MockPanel>
  );
}
