import { eachDayOfInterval } from 'date-fns';

export const datasets = [
  {
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
    title: 'Daily 3',
    timeDensity: 'day',
    domain: eachDayOfInterval({
      start: new Date('2020-01-01'),
      end: new Date('2021-01-01')
    })
  }
];

export const extraDataset = {
  title: 'Daily infinity!',
  timeDensity: 'day',
  domain: eachDayOfInterval({
    start: new Date('2000-01-01'),
    end: new Date('2021-12-12')
  })
};
