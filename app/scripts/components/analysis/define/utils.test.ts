import { getNumberOfItemsWithinTimeRange } from './utils';

describe('Item number logic', () => {

  it('checks when the dataset is not periodic', () => {
    const notPeriodicDataset = {
      isPeriodic: false,
      timeseries: [
        "2001-01-16T15:07:02Z",
        "2001-12-02T15:05:04Z",
        "2002-12-21T15:04:52Z",
        "2004-02-26T15:05:40Z",
        "2005-02-12T15:06:08Z",
        "2006-12-16T15:06:44Z",
        "2007-01-17T15:06:46Z",
        "2008-01-04T15:06:55Z",
        "2008-02-21T15:06:48Z",
        "2008-12-05T15:05:57Z",
        "2009-12-08T15:07:25Z",
        "2010-01-09T15:07:59Z", // match
        "2010-01-25T15:08:13Z", // match
        "2010-02-10T15:08:25Z", // match
        "2010-12-27T15:09:41Z", // match
        "2011-01-12T15:09:50Z", // match
        "2011-01-28T15:09:56Z", // match
        "2011-11-12T15:10:06Z",
        "2011-12-30T15:10:33Z"]
    };

    const userStart = "2010-01-01T00:00:00Z";
    const userEnd = "2011-11-01T00:00:00Z";

    const numberOfDates = getNumberOfItemsWithinTimeRange(userStart, userEnd, notPeriodicDataset);


    expect(numberOfDates).toEqual(6);
  });
});
