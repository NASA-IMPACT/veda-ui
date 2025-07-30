import React, { memo, useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useAtom, useAtomValue } from 'jotai';
import format from 'date-fns/format';
import startOfYear from 'date-fns/startOfYear';
import endOfYear from 'date-fns/endOfYear';
import { scaleTime, ScaleTime } from 'd3';

import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Toolbar, ToolbarGroup, VerticalDivider } from '@devseed-ui/toolbar';

import { isEqual } from 'lodash';
import { View } from 'react-calendar/dist/cjs/shared/types';
import { TimeDensity } from './../../types.d.ts';
import { DateAxis } from './date-axis';
import { TimelineZoomControls } from './timeline-zoom-controls';
import { TimelineDatePicker } from './timeline-datepicker';
import { TimelineHead } from './timeline';
import { TemporalExtent } from './timeline-utils';

import {
  timelineWidthAtom,
  zoomTransformAtom
} from '$components/exploration/atoms/timeline';

import { useScales } from '$components/exploration/hooks/scales-hooks';
import {
  selectedCompareDateAtom,
  selectedDateAtom,
  selectedIntervalAtom
} from '$components/exploration/atoms/dates';
import { DAY_SIZE_MAX } from '$components/exploration/constants';
import { CollecticonCalendarMinus } from '$components/common/icons-legacy/calendar-minus';
import { CollecticonCalendarPlus } from '$components/common/icons-legacy/calendar-plus';
import { TipToolbarIconButton } from '$components/common/tip-button';
import useAois from '$components/common/map/controls/hooks/use-aois';
import { useOnTOIZoom } from '$components/exploration/hooks/use-toi-zoom';
import {
  RIGHT_AXIS_SPACE,
  HEADER_COLUMN_WIDTH
} from '$components/exploration/constants';

const TimelineControlsSelf = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  min-width: 0;

  .date-axis {
    margin-top: auto;
  }
`;

const ControlsToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${glsp(1.5, 1, 0.5, 1)};
  position: relative;

  ${ToolbarGroup /* sc-selector */}:last-child:not(:first-child) {
    margin-left: auto;
  }
`;

const DatePickersWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const EmptyDateAxisWrapper = styled.div`
  padding-top: ${glsp(3)};
`;

const ToolbarFullWidth = styled(Toolbar)`
  width: 100%;
`;

interface TimelineControlsProps {
  xScaled?: ScaleTime<number, number>;
  width: number;
  outOfViewHeads?: TimelineHead[];
  onZoom: (zoom: number) => void;
  timeDensity: TimeDensity;
  timelineLabelsFormat: string;
  minMaxTemporalExtent: TemporalExtent;
}

export function getInitialScale(width) {
  const now = new Date();
  return scaleTime()
    .domain([startOfYear(now), endOfYear(now)])
    .range([0, width]);
}

export function TimelineDateAxis(
  props: Omit<
    TimelineControlsProps,
    'onZoom' | 'timeDensity' | 'timelineLabelsFormat' | 'minMaxTemporalExtent'
  >
) {
  const { xScaled, width } = props;
  const initialScale = useMemo(() => {
    return getInitialScale(width);
  }, [width]);

  return (
    <TimelineControlsSelf>
      <EmptyDateAxisWrapper>
        <DateAxis xScaled={xScaled ?? initialScale} width={width} />
      </EmptyDateAxisWrapper>
    </TimelineControlsSelf>
  );
}

export const TIMELINE_PLAYHEAD_COLOR_PRIMARY = '#8b8b8b';
export const TIMELINE_PLAYHEAD_COLOR_SECONDARY = '#333333';
export const TIMELINE_PLAYHEAD_COLOR_TEXT = '#ffffff';
export const TIMELINE_PLAYHEAD_COLOR_LABEL = '#cccccc';

const TimelineHeadIndicatorsWrapper = styled.div`
  position: absolute;
  bottom: -30px;
  width: 100%;
`;

interface PlayheadProps {
  secondary?: boolean;
}

const TimelinePlayheadBase = styled.div<PlayheadProps>`
  background-color: ${TIMELINE_PLAYHEAD_COLOR_PRIMARY};
  color: ${TIMELINE_PLAYHEAD_COLOR_TEXT};
  padding: ${glsp(0.15)} ${glsp(0.3)};
  border-radius: ${themeVal('shape.rounded')};
  font-size: 0.75rem;
  position: relative;
  width: max-content;
  font-weight: ${themeVal('type.base.regular')};

  &::after,
  &::before {
    content: '';
    position: absolute;
    bottom: 1px;
    width: 0;
    height: 0;
    border-top: 11.5px solid transparent;
    border-bottom: 11.5px solid transparent;
  }
`;

const PlayheadArrow = css<PlayheadProps>`
  &::after,
  &::before {
    content: '';
    position: absolute;
    bottom: 1px;
    width: 0;
    height: 0;
    border-top: 11.5px solid transparent;
    border-bottom: 11.5px solid transparent;
  }
`;

const LeftPlayheadArrow = css<PlayheadProps>`
  ${PlayheadArrow}
  &::after {
    border-right: 8px solid
      ${(props) =>
        props.secondary
          ? TIMELINE_PLAYHEAD_COLOR_PRIMARY
          : TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  }
`;

const RightPlayheadArrow = css<PlayheadProps>`
  ${PlayheadArrow}
  &::before {
    border-left: 8px solid
      ${(props) =>
        props.secondary
          ? TIMELINE_PLAYHEAD_COLOR_PRIMARY
          : TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  }
`;

const TimelinePlayheadLeftIndicator = styled(TimelinePlayheadBase)`
  background-color: ${(props) =>
    props.secondary
      ? TIMELINE_PLAYHEAD_COLOR_PRIMARY
      : TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  ${LeftPlayheadArrow}
  &::after {
    left: ${(props) => (props.secondary ? '-28%' : '-8%')};
  }
`;

const TimelinePlayheadRightIndicator = styled(TimelinePlayheadBase)`
  background-color: ${(props) =>
    props.secondary
      ? TIMELINE_PLAYHEAD_COLOR_PRIMARY
      : TIMELINE_PLAYHEAD_COLOR_SECONDARY};
  ${RightPlayheadArrow}
  &::before {
    right: ${(props) => (props.secondary ? '-28%' : '-8%')};
  }
`;

const TimelineHeadIndicatorsBase = styled.div`
  position: absolute;
  bottom: 1px;
  display: flex;
  gap: ${glsp(1)};
`;

const TimelineHeadLeftIndicators = styled(TimelineHeadIndicatorsBase)`
  left: 0;
`;

const TimelineHeadRightIndicators = styled(TimelineHeadIndicatorsBase)`
  right: 125px;
  flex-direction: row-reverse;
`;

export const TimelineHeadIndicators = memo(
  ({
    outOfViewHeads,
    timelineLabelsFormat
  }: {
    outOfViewHeads: TimelineHead[];
    timelineLabelsFormat: string;
  }) => {
    // Filter the out-of-view heads to get those that are out to the left
    const leftHeads = outOfViewHeads.filter(
      (head) => head.outDirection === 'left'
    );
    // Filter the out-of-view heads to get those that are out to the right
    const rightHeads = outOfViewHeads.filter(
      (head) => head.outDirection === 'right'
    );

    return (
      <>
        {/* If there are any heads out to the left, render the left indicators */}
        {leftHeads.length > 0 && (
          <TimelineHeadLeftIndicators data-tour='left-indicator'>
            <TimelinePlayheadLeftIndicator>
              <span>{format(leftHeads[0].date, timelineLabelsFormat)}</span>
            </TimelinePlayheadLeftIndicator>
            {leftHeads.length > 1 && (
              <TimelinePlayheadLeftIndicator secondary>
                +{leftHeads.length - 1}
              </TimelinePlayheadLeftIndicator>
            )}
          </TimelineHeadLeftIndicators>
        )}
        {/* If there are any heads out to the right, render the right indicators */}
        {rightHeads.length > 0 && (
          <TimelineHeadRightIndicators data-tour='left-indicator'>
            <TimelinePlayheadRightIndicator>
              <span>
                {format(
                  rightHeads[rightHeads.length - 1].date,
                  timelineLabelsFormat
                )}
              </span>
            </TimelinePlayheadRightIndicator>
            {rightHeads.length > 1 && (
              <TimelinePlayheadRightIndicator secondary>
                +{rightHeads.length - 1}
              </TimelinePlayheadRightIndicator>
            )}
          </TimelineHeadRightIndicators>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    // React.memo does a shallow comparison of props, so we need to supply
    // a custom comparison function to compare the outOfViewHead objects
    return isEqual(prevProps.outOfViewHeads, nextProps.outOfViewHeads);
  }
);

TimelineHeadIndicators.displayName = 'TimelineHeadIndicators';

/**
 * Determines the appropriate calendar view based on the time density.
 *
 * The TimeDensity enumeration is mapped to the corresponding calendar view:
 * - MONTH: Displays the calendar in 'year' view, showing all months in a year.
 * - YEAR: Displays the calendar in 'decade' view, showing multiple years in a decade.
 * - Default: Displays the calendar in 'month' view, showing all days of the current month.
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

export function TimelineControls(props: TimelineControlsProps) {
  const {
    xScaled,
    width,
    outOfViewHeads,
    onZoom,
    timeDensity,
    timelineLabelsFormat,
    minMaxTemporalExtent
  } = props;

  const [selectedDay, setSelectedDay] = useAtom(selectedDateAtom);

  const [selectedCompareDay, setSelectedCompareDay] = useAtom(
    selectedCompareDateAtom
  );
  const [selectedInterval, setSelectedInterval] = useAtom(selectedIntervalAtom);
  const { features } = useAois();

  // Scale to use when there are no datasets with data (loading or error)
  const initialScale = useMemo(() => getInitialScale(width), [width]);

  const calendarView = useMemo(
    () => getCalendarView(timeDensity),
    [timeDensity]
  );
  //Center to selected point
  const { onTOIZoom } = useOnTOIZoom();
  const timelineWidth = useAtomValue(timelineWidthAtom);
  const { k: currentZoomTransformRatio } = useAtomValue(zoomTransformAtom);
  const { main } = useScales();
  const visualBufferSizing = 0.9;
  const startPoint = 0;

  const calculateNewTOIZoom = (
    dateStart: number,
    dateEnd: number,
    widthToFit: number
  ): { zTransform: number; panPosition: number } => {
    const zTransform = widthToFit / (dateEnd - dateStart);
    const panPosition = startPoint - zTransform * dateStart;
    return { zTransform, panPosition };
  };

  const centerTimelineOnSelections = useCallback(
    (newDate: {
      selectedDay?: Date | null;
      start?: Date | null;
      end?: Date | null;
      selectedCompareDay?: Date | null;
    }) => {
      if (!timelineWidth || !main) return;

      //defining width of visible area after confirming we have a timeline width
      const widthToFit =
        (timelineWidth - RIGHT_AXIS_SPACE - HEADER_COLUMN_WIDTH) *
        visualBufferSizing;

      //setting most recent date value depending on interaction
      const newSelectedDay = newDate.selectedDay ?? selectedDay;
      const newSelectedCompareDay =
        newDate.selectedCompareDay ?? selectedCompareDay;
      const newSelectedStartInterval = newDate.start ?? selectedInterval?.start;
      const newSelectedEndInterval = newDate.end ?? selectedInterval?.end;

      let newZoomArgs: { zTransform: number; panPosition: number } = {
        zTransform: 0,
        panPosition: 0
      };

      if (newSelectedDay) {
        const calcNewSelectedDay = main(newSelectedDay);

        const halfOfCurrentWidth = 0.5;
        const timelineCenter = widthToFit * halfOfCurrentWidth;

        newZoomArgs.zTransform = currentZoomTransformRatio;
        newZoomArgs.panPosition =
          startPoint -
          newZoomArgs.zTransform * calcNewSelectedDay +
          timelineCenter;

        if (newSelectedCompareDay) {
          const calcNewSelectedCompareDay = main(newSelectedCompareDay);

          if (newSelectedDay < newSelectedCompareDay) {
            newZoomArgs = calculateNewTOIZoom(
              calcNewSelectedDay,
              calcNewSelectedCompareDay,
              widthToFit
            );
          } else {
            newZoomArgs = calculateNewTOIZoom(
              calcNewSelectedCompareDay,
              calcNewSelectedDay,
              widthToFit
            );
          }
        }
      }
      if (newSelectedStartInterval && newSelectedEndInterval) {
        const calcNewSelectedEndInterval = main(newSelectedEndInterval);
        const calcNewSelectedStartInterval = main(newSelectedStartInterval);
        if (newSelectedStartInterval > newSelectedEndInterval) {
          newZoomArgs = calculateNewTOIZoom(
            calcNewSelectedEndInterval,
            calcNewSelectedStartInterval,
            widthToFit
          );
        } else {
          newZoomArgs = calculateNewTOIZoom(
            calcNewSelectedStartInterval,
            calcNewSelectedEndInterval,
            widthToFit
          );
        }
      }
      return onTOIZoom(newZoomArgs.panPosition, newZoomArgs.zTransform);
    },
    [
      selectedDay,
      selectedInterval,
      selectedCompareDay,
      currentZoomTransformRatio,
      main,
      timelineWidth,
      onTOIZoom
    ]
  );

  return (
    <TimelineControlsSelf>
      <ControlsToolbar>
        {outOfViewHeads && outOfViewHeads.length > 0 && (
          <TimelineHeadIndicatorsWrapper>
            <TimelineHeadIndicators
              outOfViewHeads={outOfViewHeads}
              timelineLabelsFormat={timelineLabelsFormat}
            />
          </TimelineHeadIndicatorsWrapper>
        )}
        <ToolbarFullWidth>
          <ToolbarGroup>
            {!selectedInterval && (
              <>
                {!selectedCompareDay && (
                  <TipToolbarIconButton
                    visuallyDisabled={!!features.length}
                    tipContent={
                      features.length
                        ? 'Compare is not possible when there are areas of interest on the map'
                        : 'Add date to compare'
                    }
                    size='small'
                    variation='primary-text'
                    data-tour='compare-date'
                    onClick={() => {
                      if (!xScaled || !selectedDay) return;
                      const [, max] = xScaled.range();

                      const currentX = xScaled(selectedDay);
                      const nextX = currentX + DAY_SIZE_MAX;
                      const newDate = xScaled.invert(
                        nextX > max ? currentX - DAY_SIZE_MAX : nextX
                      );
                      setSelectedCompareDay(newDate);
                      centerTimelineOnSelections({
                        selectedCompareDay: newDate
                      });
                    }}
                  >
                    <CollecticonCalendarPlus
                      meaningful
                      title='Add comparison date'
                    />
                    Add date to compare
                  </TipToolbarIconButton>
                )}

                {selectedCompareDay && (
                  <TipToolbarIconButton
                    tipContent='Stop comparing dates'
                    size='small'
                    variation='primary-text'
                    onClick={() => {
                      setSelectedCompareDay(null);
                    }}
                  >
                    <CollecticonCalendarMinus
                      meaningful
                      title='Stop comparing dates'
                    />
                    Stop comparing dates
                  </TipToolbarIconButton>
                )}
              </>
            )}
            {selectedInterval ? (
              <DatePickersWrapper>
                <TimelineDatePicker
                  minDate={minMaxTemporalExtent[0]}
                  maxDate={minMaxTemporalExtent[1]}
                  triggerHeadReference='FROM:'
                  selectedDay={selectedInterval.start}
                  onConfirm={(d) => {
                    if (!d) return;
                    setSelectedInterval({
                      ...selectedInterval,
                      start: new Date(d)
                    });
                    centerTimelineOnSelections({ start: new Date(d) });
                  }}
                  disabled={!xScaled}
                  tipContent='Start date for analysis'
                  dataTourId='date-picker-start'
                  calendarView={calendarView}
                  triggerLabelFormat={timelineLabelsFormat}
                />
                <VerticalDivider />
                <TimelineDatePicker
                  minDate={minMaxTemporalExtent[0]}
                  maxDate={minMaxTemporalExtent[1]}
                  triggerHeadReference={selectedCompareDay ? 'A:' : ''}
                  selectedDay={selectedDay}
                  onConfirm={(d) => {
                    if (!d) return;
                    setSelectedDay(new Date(d));
                    centerTimelineOnSelections({ selectedDay: new Date(d) });
                  }}
                  disabled={!xScaled}
                  tipContent={
                    selectedCompareDay
                      ? 'Date shown on left map '
                      : 'Date shown on map'
                  }
                  dataTourId='date-picker-a'
                  calendarView={calendarView}
                  triggerLabelFormat={timelineLabelsFormat}
                />
                <VerticalDivider />
                <TimelineDatePicker
                  minDate={minMaxTemporalExtent[0]}
                  maxDate={minMaxTemporalExtent[1]}
                  triggerHeadReference='TO:'
                  selectedDay={selectedInterval.end}
                  onConfirm={(d) => {
                    if (!d) return;
                    setSelectedInterval({
                      ...selectedInterval,
                      end: new Date(d)
                    });
                    centerTimelineOnSelections({ end: new Date(d) });
                  }}
                  disabled={!xScaled}
                  tipContent='End date for analysis'
                  dataTourId='date-picker-end'
                  calendarView={calendarView}
                  triggerLabelFormat={timelineLabelsFormat}
                />
              </DatePickersWrapper>
            ) : (
              <>
                <DatePickersWrapper>
                  {/* DEFAULT DATE PICKER */}

                  <TimelineDatePicker
                    minDate={minMaxTemporalExtent[0]}
                    maxDate={minMaxTemporalExtent[1]}
                    triggerHeadReference={selectedCompareDay ? 'A:' : ''}
                    selectedDay={selectedDay}
                    onConfirm={(d) => {
                      if (!d) return;

                      setSelectedDay(new Date(d));
                      centerTimelineOnSelections({ selectedDay: new Date(d) });
                    }}
                    disabled={!xScaled}
                    tipContent={
                      selectedCompareDay
                        ? 'Date shown on left map '
                        : 'Date shown on map'
                    }
                    dataTourId='date-picker-a'
                    calendarView={calendarView}
                    triggerLabelFormat={timelineLabelsFormat}
                  />
                  {selectedCompareDay && (
                    <>
                      <VerticalDivider />
                      <TimelineDatePicker
                        minDate={minMaxTemporalExtent[0]}
                        maxDate={minMaxTemporalExtent[1]}
                        triggerHeadReference='B:'
                        selectedDay={selectedCompareDay}
                        onConfirm={(d) => {
                          if (!d) return;
                          setSelectedCompareDay(new Date(d));
                          centerTimelineOnSelections({
                            selectedCompareDay: new Date(d)
                          });
                        }}
                        disabled={!xScaled}
                        tipContent='Date shown on right map'
                        dataTourId='date-picker-b'
                        calendarView={calendarView}
                        triggerLabelFormat={timelineLabelsFormat}
                      />
                    </>
                  )}
                </DatePickersWrapper>
              </>
            )}
            <TimelineZoomControls onZoom={onZoom} />
          </ToolbarGroup>
        </ToolbarFullWidth>
      </ControlsToolbar>

      <DateAxis xScaled={xScaled ?? initialScale} width={width} />
    </TimelineControlsSelf>
  );
}
