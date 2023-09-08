import React from 'react';
import { eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { useSetAtom } from 'jotai';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';

import { isAnalysisAtom, isExpandedAtom, timelineDatasetsAtom } from './atoms/atoms';
import {
  TimelineDataset,
  TimelineDatasetAnalysis,
  TimelineDatasetStatus
} from './types.d.ts';

const chartData = {
  status: 'success',
  meta: {
    total: 9,
    loaded: 9
  },
  data: {
    timeseries: [
      {
        date: new Date('2020-10-01T00:00:00'),
        min: -2086298214989824,
        max: 12890265228410880,
        mean: 798724301873588,
        count: 82701,
        sum: 66055298489247600000,
        std: 714889121800240.6
      },
      {
        date: new Date('2020-09-01T00:00:00'),
        min: -243302179799040,
        max: 6783829977071616,
        mean: 826268261725556.4,
        count: 83024,
        sum: 68600096161502590000,
        std: 525758341466615.44
      },
      {
        date: new Date('2020-08-01T00:00:00'),
        min: -141698134966272,
        max: 3727485078339584,
        mean: 725800731063289.5,
        count: 83024,
        sum: 60258879895798550000,
        std: 353335499843328.06
      },
      {
        date: new Date('2020-07-01T00:00:00'),
        min: -147666428231680,
        max: 3569522892079104,
        mean: 786568136687148.8,
        count: 83024,
        sum: 65304032980313830000,
        std: 366549997729682.4
      },
      {
        date: new Date('2020-06-01T00:00:00'),
        min: -255044100292608,
        max: 3507326933794816,
        mean: 771834013412698,
        count: 83024,
        sum: 64080747129575830000,
        std: 379108800939232
      },
      {
        date: new Date('2020-05-01T00:00:00'),
        min: -274287718039552,
        max: 5203029145944064,
        mean: 800096907890949,
        count: 83024,
        sum: 66427245680738170000,
        std: 396133006092423.75
      },
      {
        date: new Date('2020-04-01T00:00:00'),
        min: -1733678178762752,
        max: 4642589600907264,
        mean: 698716974847719.5,
        count: 82956,
        sum: 57962765365467415000,
        std: 450048731150610.9
      },
      {
        date: new Date('2020-03-01T00:00:00'),
        min: -800272532111360,
        max: 8905950232576000,
        mean: 705833097884692.6,
        count: 82988,
        sum: 58575677127254870000,
        std: 528843673285467.1
      },
      {
        date: new Date('2020-02-01T00:00:00'),
        min: -426854754287616,
        max: 12515318878437376,
        mean: 781040757444822.8,
        count: 82978,
        sum: 64809199971256500000,
        std: 832389364703228.4
      }
    ]
  }
};

const chartData2 = {
  status: 'success',
  meta: {
    total: 15,
    loaded: 15
  },
  data: {
    timeseries: [
      {
        date: new Date('2020-04-01T00:00:00'),
        min: -6,
        max: 17,
        mean: 8
      },
      {
        date: new Date('2020-04-02T00:00:00'),
        min: -9,
        max: 15,
        mean: 5
      },
      {
        date: new Date('2020-04-03T00:00:00'),
        min: -3,
        max: 15,
        mean: 10
      },
      {
        date: new Date('2020-04-04T00:00:00'),
        min: 2,
        max: 18,
        mean: 6
      },
      {
        date: new Date('2020-04-05T00:00:00'),
        min: 3,
        max: 19,
        mean: 15
      },
      {
        date: new Date('2020-04-06T00:00:00'),
        min: null,
        max: null,
        mean: null
      },
      {
        date: new Date('2020-04-07T00:00:00'),
        min: -8,
        max: 17,
        mean: 8
      },
      {
        date: new Date('2020-04-08T00:00:00'),
        min: -8,
        max: 19,
        mean: 9
      },
      {
        date: new Date('2020-04-09T00:00:00'),
        min: 2,
        max: 15,
        mean: 8
      },
      {
        date: new Date('2020-04-10T00:00:00'),
        min: null,
        max: null,
        mean: null
      },
      {
        date: new Date('2020-04-11T00:00:00'),
        min: 3,
        max: 20,
        mean: 8
      },
      {
        date: new Date('2020-04-12T00:00:00'),
        min: 0,
        max: 20,
        mean: 10
      },
      {
        date: new Date('2020-04-13T00:00:00'),
        min: -10,
        max: 16,
        mean: 11
      },
      {
        date: new Date('2020-04-14T00:00:00'),
        min: -9,
        max: 16,
        mean: 11
      },
      {
        date: new Date('2020-04-15T00:00:00'),
        min: 3,
        max: 17,
        mean: 9
      }
    ]
  }
};

const extraDataset = {
  id: 'infinity',
  name: 'Daily infinity!',
  timeDensity: 'day',
  domain: eachDayOfInterval({
    start: new Date('2000-01-01'),
    end: new Date('2021-12-12')
  })
};

const dataset2020 = {
  id: '2020',
  name: '2020',
  timeDensity: 'month',
  domain: eachMonthOfInterval({
    start: new Date('2020-01-01'),
    end: new Date('2020-12-01')
  }),
  analysis: chartData
};

const dataset2Months = {
  id: 'two-dates',
  name: 'Two Dates',
  timeDensity: 'month',
  domain: [new Date('2020-01-01'), new Date('2020-02-01')]
};

const dataset2Days = {
  id: 'two-days',
  name: 'Two Days',
  timeDensity: 'day',
  domain: [new Date('2020-01-05'), new Date('2020-01-06')]
};

const datasetSingle = {
  id: 'single-dates',
  name: 'Single Date',
  timeDensity: 'day',
  domain: [new Date('2020-01-01')],
  analysis: chartData2
};

const datasets = [
  {
    id: 'monthly',
    name: 'Monthly dataset',
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
    name: 'Daily dataset',
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
    name: 'Daily 2',
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
    name: 'Daily 3',
    timeDensity: 'day',
    domain: eachDayOfInterval({
      start: new Date('2020-01-01'),
      end: new Date('2021-01-01')
    })
  }
].map((d) => makeDataset(d));

function makeAnalysis(
  data,
  meta,
  status = TimelineDatasetStatus.IDLE
): TimelineDatasetAnalysis {
  return {
    status,
    meta,
    data,
    error: null
  };
}

function makeDataset(
  data: any,
  status = TimelineDatasetStatus.SUCCESS,
  settings: Record<string, any> = {},
  analysis = makeAnalysis({}, {})
) {
  return {
    mocked: true,
    status,
    data,
    error: status === TimelineDatasetStatus.ERROR ? new Error('Mock error') : null,
    settings: {
      ...settings,
      isVisible: settings.isVisible === undefined ? true : settings.isVisible
    },
    analysis
  } as TimelineDataset;
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
  const setIsExpanded = useSetAtom(isExpandedAtom);
  const setIsAnalysis = useSetAtom(isAnalysisAtom);

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
                  name: 'Loading dataset'
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
                  id: 'error',
                  name: 'Error dataset'
                },
                TimelineDatasetStatus.ERROR
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
          set(
            toggleDataset(
              makeDataset(
                datasetSingle,
                TimelineDatasetStatus.SUCCESS,
                {},
                makeAnalysis(
                  chartData2.data,
                  chartData2.meta,
                  TimelineDatasetStatus.SUCCESS
                )
              )
            )
          );
        }}
        variation='base-outline'
      >
        toggle Single date
      </Button>
      <Button
        onClick={() => {
          set(
            toggleDataset(
              makeDataset(
                dataset2020,
                TimelineDatasetStatus.SUCCESS,
                {},
                makeAnalysis(
                  chartData.data,
                  chartData.meta,
                  TimelineDatasetStatus.SUCCESS
                )
              )
            )
          );
        }}
        variation='base-outline'
      >
        toggle dataset 2020
      </Button>
      <Button
        onClick={() => {
          set(
            toggleDataset(
              makeDataset(
                {
                  ...dataset2020,
                  id: 'analysis-loading',
                  name: 'Analysis loading'
                },
                TimelineDatasetStatus.SUCCESS,
                {},
                makeAnalysis(
                  {},
                  { loaded: 34, total: 100 },
                  TimelineDatasetStatus.LOADING
                )
              )
            )
          );
        }}
        variation='base-outline'
      >
        toggle Analysis loading
      </Button>
      <Button
        onClick={() => {
          set(
            toggleDataset(
              makeDataset(
                {
                  ...dataset2020,
                  id: 'analysis-error',
                  name: 'Analysis Error'
                },
                TimelineDatasetStatus.SUCCESS,
                {},
                makeAnalysis(
                  {},
                  { loaded: 34, total: 100 },
                  TimelineDatasetStatus.ERROR
                )
              )
            )
          );
        }}
        variation='base-outline'
      >
        toggle Analysis error
      </Button>
      <Button
        onClick={() => {
          setIsExpanded((v) => !v);
        }}
        variation='primary-outline'
      >
        Toggle expanded
      </Button>
      <Button
        onClick={() => {
          setIsAnalysis((v) => !v);
        }}
        variation='primary-outline'
      >
        Toggle analysis
      </Button>
    </MockPanel>
  );
}
