import React, { useMemo } from 'react';
import { View } from 'react-calendar/dist/cjs/shared/types';
import { getLabelFormat, getTemporalExtent } from '../timeline/timeline-utils';
import { TimelineDatePicker } from '../timeline/timeline-datepicker';
import { TimeDensity } from '../../types.d.ts';
import { getLowestCommonTimeDensity } from '$components/exploration/data-utils';

import {
  TimelineDataset,
  DatasetStatus,
  TimelineDatasetSuccess
} from '$components/exploration/types.d.ts';

interface EmbedTimelineProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
  timeDensity: TimeDensity;
  datasets: TimelineDataset[];
  label: string;
}

function EmbedTimeline(props: EmbedTimelineProps) {
  const { date, setDate, timeDensity, datasets, label } = props;

  const lowestCommonTimeDensity = useMemo(
    () =>
      getLowestCommonTimeDensity(
        // Filter the datasets to only include those with status 'SUCCESS'.
        // The function getLowestCommonTimeDensity expects an array of TimelineDatasetSuccess objects,
        // which have the 'data.timeDensity' property (formated as such).
        datasets.filter(
          (dataset): dataset is TimelineDatasetSuccess =>
            dataset.status === DatasetStatus.SUCCESS
        )
      ),
    [datasets]
  );

  const minMaxTemporalExtent = useMemo(
    () =>
      getTemporalExtent(
        // Filter the datasets to only include those with status 'SUCCESS'.
        datasets.filter(
          (dataset): dataset is TimelineDatasetSuccess =>
            dataset.status === DatasetStatus.SUCCESS
        )
      ),
    [datasets]
  );

  const timelineLabelFormat = useMemo(
    () => getLabelFormat(lowestCommonTimeDensity),
    [lowestCommonTimeDensity]
  );
  const getCalendarView = (timeDensity: TimeDensity): View => {
    switch (timeDensity) {
      case TimeDensity.MONTH:
        return 'year';
      case TimeDensity.YEAR:
        return 'decade';
      default:
        return 'month';
    }
  };
  const calendarView = useMemo(
    () => getCalendarView(timeDensity),
    [timeDensity]
  );

  return (
    <div
      style={{ height: '5rem', width: '100%' }}
      className='display-flex flex-align-center z-index-100'
    >
      <TimelineDatePicker
        triggerHeadReference={label}
        minDate={minMaxTemporalExtent[0]}
        maxDate={minMaxTemporalExtent[1]}
        selectedDay={date}
        onConfirm={(d) => {
          if (!d) return;
          setDate(new Date(d));
        }}
        disabled={false}
        dataTourId={'date-picker-' + label}
        calendarView={calendarView}
        triggerLabelFormat={timelineLabelFormat}
      />
    </div>
  );
}

export default EmbedTimeline;
