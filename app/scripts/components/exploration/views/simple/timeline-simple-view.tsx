import React, { useMemo } from 'react';
import styled from 'styled-components';
import { View } from 'react-calendar/dist/cjs/shared/types';
import { TimelineDatePicker } from '$components/exploration/components/timeline/timeline-datepicker';
import {
  getLabelFormat,
  getTemporalExtent
} from '$components/exploration/components/timeline/timeline-utils';
import { getLowestCommonTimeDensity } from '$components/exploration/data-utils';

import {
  TimeDensity,
  TimelineDataset,
  DatasetStatus,
  TimelineDatasetSuccess
} from '$components/exploration/types';

const TimelineWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  color: black;
  background-color: white;
  border-radius: 2px;
`;
interface TimelineSimpleViewProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
  timeDensity: TimeDensity;
  datasets: TimelineDataset[];
  label: string;
  tipContent?: string;
}

/**
 * Timeline date picker for the simple exploration view.
 *
 * Adjusts calendar view (month/year/day) based on dataset time density
 * and calculates temporal extent from provided datasets.
 *
 * @param props.date - Currently selected date
 * @param props.setDate - Callback to update the selected date
 * @param props.timeDensity - Dataset time density (determines calendar view)
 * @param props.datasets - Datasets used to calculate temporal extent
 */
function TimelineSimpleView(props: TimelineSimpleViewProps) {
  const { date, setDate, timeDensity, datasets, label, tipContent } = props;

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
    <TimelineWrapper>
      <TimelineDatePicker
        triggerHeadReference={label}
        minDate={minMaxTemporalExtent[0]}
        maxDate={minMaxTemporalExtent[1]}
        selectedDay={date}
        tipContent={tipContent}
        onConfirm={(d) => {
          if (!d) return;
          setDate(new Date(d));
        }}
        disabled={false}
        dataTourId={'date-picker-' + label}
        calendarView={calendarView}
        triggerLabelFormat={timelineLabelFormat}
      />
    </TimelineWrapper>
  );
}

export default TimelineSimpleView;
