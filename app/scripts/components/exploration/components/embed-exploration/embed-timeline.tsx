/**
 * @fileoverview Embedded Timeline Component for E&A embed mode.
 * This module provides a compact timeline date picker component for the
 * embedded exploration view. It allows users to select dates within the
 * temporal extent of the loaded datasets.
 * 
 * The component automatically determines the appropriate calendar view
 * (month, year, decade) based on the dataset's time density.
 * 
 * @module exploration/components/embed-exploration/embed-timeline
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
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

/**
 * Styled wrapper for the timeline date picker.
 * Provides a compact, centered container with a white background
 * for visibility over the map in embed mode.
 */
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

/**
 * Props interface for the EmbedTimeline component.
 * @interface EmbedTimelineProps
 */
interface EmbedTimelineProps {
  /** Currently selected date, or null if none selected */
  date: Date | null;
  /** Callback to update the selected date */
  setDate: (date: Date | null) => void;
  /** Time density of the dataset (day, month, year) */
  timeDensity: TimeDensity;
  /** Array of timeline datasets to determine temporal extent */
  datasets: TimelineDataset[];
  /** Label for the date picker (used for accessibility and tours) */
  label: string;
}

/**
 * Determines the appropriate calendar view based on the time density.
 * Maps time density to react-calendar View type.
 * 
 * @param {TimeDensity} timeDensity - The time density of the dataset
 * @returns {View} The calendar view to use ('month', 'year', or 'decade')
 */
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

/**
 * Compact timeline date picker component for embed mode.
 * Displays a date picker that allows users to select dates within
 * the temporal extent of the loaded datasets. Automatically adapts
 * the calendar view and label format based on the lowest common
 * time density of all datasets.
 * 
 * @component
 * @param {EmbedTimelineProps} props - Component props
 * @returns {JSX.Element} The embed timeline component
 * 
 * @example
 * <EmbedTimeline
 *   date={selectedDate}
 *   setDate={setSelectedDate}
 *   timeDensity={TimeDensity.DAY}
 *   datasets={timelineDatasets}
 *   label="Primary"
 * />
 */
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

export default EmbedTimeline;
