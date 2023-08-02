import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import styled from 'styled-components';
import useDimensions from 'react-cool-dimensions';
import { Reorder } from 'framer-motion';
import { ZoomTransform, select, zoom } from 'd3';
import { add, format, isAfter, isBefore, startOfDay, sub } from 'date-fns';
import { glsp, listReset, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonChevronDownSmall,
  CollecticonPlusSmall
} from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import { DatePicker } from '@devseed-ui/date-picker';

import {
  selectedDateAtom,
  selectedIntervalAtom,
  timelineDatasetsAtom,
  timelineSizesAtom,
  timelineWidthAtom,
  zoomTransformAtom
} from './atoms';
import { DatasetListItem } from './dataset-list-item';
import {
  TimelineHeadL,
  TimelineHeadP,
  TimelineHeadR,
  TimelineRangeTrack
} from './timeline-head';
import { DateAxis, DateGrid } from './date-axis';
import { emptyDateRange, RIGHT_AXIS_SPACE } from './constants';
import { applyTransform, isEqualTransform, rescaleX } from './utils';
import { useScaleFactors, useScales, useTimelineDatasetsDomain } from './hooks';

import { useEffectPrevious } from '$utils/use-effect-previous';

const TimelineWrapper = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  height: 100%;

  svg {
    display: block;
  }
`;

const NoData = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  max-width: 20rem;
  margin: auto;
  padding: 2rem;
  gap: 1rem;
`;

const InteractionRect = styled.div`
  position: absolute;
  left: 20rem;
  top: 3.5rem;
  bottom: 0;
  right: ${RIGHT_AXIS_SPACE}px;
  /* background-color: rgba(255, 0, 0, 0.08); */
  box-shadow: 1px 0 0 0 ${themeVal('color.base-200')};
  z-index: 100;
`;

const TimelineHeader = styled.header`
  display: flex;
  flex-shrink: 0;
  box-shadow: 0 1px 0 0 ${themeVal('color.base-200')};
`;

const TimelineDetails = styled.div`
  width: 20rem;
  flex-shrink: 0;
  box-shadow: 1px 0 0 0 ${themeVal('color.base-200')},
    0 1px 0 0 ${themeVal('color.base-200')};
  padding: ${glsp(0.5, 0.5, 0.5, 2)};
  z-index: 1;
`;

const Headline = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TimelineControls = styled.div`
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
  padding: ${glsp(1.5, 0.5, 0.5, 0.5)};
`;

const DatePickerButton = styled(Button)`
  gap: ${glsp(0.5)};

  .head-reference {
    font-weight: ${themeVal('type.base.regular')};
    color: ${themeVal('color.base-400')};
    font-size: 0.875rem;
  }
`;

const TimelineContent = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  width: 100%;
  position: relative;
`;

const TimelineContentInner = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  position: relative;
`;

const DatasetListSelf = styled.ul`
  ${listReset()}
  width: 100%;
`;

function Timeline() {
  // Refs for non react based interactions.
  // The interaction rect is used to capture the different d3 events for the
  // zoom.
  const interactionRef = useRef<HTMLDivElement>(null);
  // Because the interaction rect traps the events, we need a ref to the
  // container to propagate the needed events to it, like scroll.
  const datasetsContainerRef = useRef<HTMLDivElement>(null);

  const datasets = useAtomValue(timelineDatasetsAtom);

  const dataDomain = useTimelineDatasetsDomain();

  // Observe the width of the timeline wrapper and store it.
  // We then use hooks to get the different needed values.
  const setTimelineWidth = useSetAtom(timelineWidthAtom);
  const { observe } = useDimensions({
    onResize: ({ width }) => {
      setTimelineWidth(width);
    }
  });

  const { contentWidth: width } = useAtomValue(timelineSizesAtom);

  const [selectedDay, setSelectedDay] = useAtom(selectedDateAtom);
  const [selectedInterval, setSelectedInterval] = useAtom(selectedIntervalAtom);

  const translateExtent = useMemo<[[number, number], [number, number]]>(
    () => [
      [0, 0],
      [width, 0]
    ],
    [width]
  );

  const [zoomTransform, setZoomTransform] = useAtom(zoomTransformAtom);

  // Calculate min and max scale factors, such has each day has a minimum of 2px
  // and a maximum of 100px.
  const { k0, k1 } = useScaleFactors();
  const { scaled: xScaled, main: xMain } = useScales();

  // Create the zoom behavior needed for the timeline interactions.
  const zoomBehavior = useMemo(() => {
    return zoom()
      .scaleExtent([k0, k1])
      .translateExtent(translateExtent)
      .extent(translateExtent)
      .filter((event) => {
        if (event.type === 'wheel' && !event.altKey) {
          // The zoom behavior traps the scroll event. Propagate to the data
          // container to scroll it.
          if (datasetsContainerRef.current) {
            datasetsContainerRef.current.scrollBy(0, event.deltaY);
          }
          return false;
        }
        return true;
      })
      .on('zoom', function (event) {
        const { sourceEvent } = event;

        if (sourceEvent?.type === 'wheel') {
          // Alt key plus wheel makes the browser go back in history. Prevent.
          if (sourceEvent.altKey) {
            sourceEvent.preventDefault();
          }
        }
        const { x, y, k } = event.transform;
        setZoomTransform((t) =>
          isEqualTransform(t, { x, y, k }) ? t : { x, y, k }
        );
      });
  }, [setZoomTransform, translateExtent, k0, k1]);

  useEffect(() => {
    if (!interactionRef.current) return;

    select(interactionRef.current)
      .call(zoomBehavior)
      .on('dblclick.zoom', null)
      .on('click', (event) => {
        const d = xScaled?.invert(event.layerX);
        d && setSelectedDay(startOfDay(d));
      })
      .on('wheel', function (event) {
        // Wheel is triggered when an horizontal wheel is used or when shift
        // wheel is used. The zoom event is only for vertical wheel so we have
        // to mimic the pan behavior.
        if (event.altKey) {
          event.preventDefault();
        }

        const element = select(this);
        // Get the current zoom transform.
        const currentT = element.property('__zoom');
        // Applying the transform will cause the zoom event to be emitted without
        // a sourceEvent. On the zoom event listener, the updated zoom transform
        // is set on the state, so there's no need to do it here
        applyTransform(
          zoomBehavior,
          element,
          currentT.x - event.deltaX,
          currentT.y,
          currentT.k
        );
      });
  }, [setSelectedDay, xScaled, zoomBehavior]);

  // When a new dataset is added we need to recompute the transform to ensure
  // the timeline view remains the same.
  useEffectPrevious(
    (prevProps) => {
      const [zb, zt, xSc] = prevProps as [
        typeof zoomBehavior | undefined,
        ZoomTransform | undefined,
        typeof xScaled | undefined
      ];

      // Only act when the zoom behavior changes.
      // Everything else should be defined but let's prevent ts errors.
      if (
        !interactionRef.current ||
        !zb ||
        !zt ||
        !xSc ||
        !xMain ||
        zb === zoomBehavior
      )
        return;

      if (zb.scaleExtent()[1] > 0) {
        const prevScaleMax = zb.scaleExtent()[1];
        const currScaleMax = zoomBehavior.scaleExtent()[1];
        // Calculate the new scale factor by using the ration between the old
        // and new scale extents.
        const k = (currScaleMax / prevScaleMax) * zt.k;
        // Rescale the main scale to be able to calculate the new x position
        const rescaled = rescaleX(xMain, 0, k);
        // The date at the start of the timeline is the initial domain of the
        // scale used to draw it - the scaled scale in this case.
        const dateAtTimelineStart = xSc.domain()[0];

        // Applying the transform will cause the zoom event to be emitted
        // without a sourceEvent. On the zoom event listener, the updated zoom
        // transform is set on the state, so there's no need to do it here.
        applyTransform(
          zoomBehavior,
          select(interactionRef.current),
          rescaled(dateAtTimelineStart) * -1,
          0,
          k
        );
      }
    },
    [zoomBehavior, zoomTransform, xScaled, xMain]
  );

  // Some of these values depend on each other, but we check all of them so
  // typescript doesn't complain.
  if (datasets.length === 0 || !xScaled || !dataDomain) {
    return (
      <TimelineWrapper ref={observe}>
        <NoData>
          <p>Select a dataset to start exploration</p>
          <Button variation='primary-fill'>
            <CollecticonPlusSmall /> Datasets
          </Button>
        </NoData>
      </TimelineWrapper>
    );
  }

  return (
    <TimelineWrapper ref={observe}>
      <InteractionRect ref={interactionRef} />
      <TimelineHeader>
        <TimelineDetails>
          <Headline>
            <Heading as='h2' size='xsmall'>
              Datasets
            </Heading>
            <Button variation='base-text' size='small'>
              <CollecticonPlusSmall meaningful title='Add dataset' />
            </Button>
          </Headline>
          <p>X of Y</p>
        </TimelineDetails>
        <TimelineControls>
          <ControlsToolbar>
            <DatePicker
              id='date-picker-p'
              value={{ start: selectedDay, end: selectedDay }}
              onConfirm={(d) => {
                setSelectedDay(d.start);
              }}
              renderTriggerElement={(props, label) => (
                <DatePickerButton {...props} size='small'>
                  <span className='head-reference'>P</span>
                  <span>{label}</span>
                  <CollecticonChevronDownSmall />
                </DatePickerButton>
              )}
            />
            <DatePicker
              id='date-picker-lr'
              value={selectedInterval ?? emptyDateRange}
              onConfirm={(d) => {
                setSelectedInterval({
                  start: d.start!,
                  end: d.end!
                });
              }}
              isClearable={false}
              isRange
              alignment='right'
              renderTriggerElement={(props) => (
                <DatePickerButton {...props} size='small'>
                  <span className='head-reference'>L</span>
                  <span>
                    {selectedInterval
                      ? format(selectedInterval.start, 'MMM do, yyyy')
                      : 'Date'}
                  </span>
                  <span className='head-reference'>R</span>
                  <span>
                    {selectedInterval
                      ? format(selectedInterval.end, 'MMM do, yyyy')
                      : 'Date'}
                  </span>
                  <CollecticonChevronDownSmall />
                </DatePickerButton>
              )}
            />
          </ControlsToolbar>

          <DateAxis xScaled={xScaled} width={width} />
        </TimelineControls>
      </TimelineHeader>
      <TimelineContent>
        {selectedDay ? (
          <TimelineHeadP
            domain={dataDomain}
            xScaled={xScaled}
            onDayChange={setSelectedDay}
            selectedDay={selectedDay}
            width={width}
          />
        ) : (
          false
        )}
        {selectedInterval && (
          <>
            <TimelineHeadL
              domain={dataDomain}
              xScaled={xScaled}
              onDayChange={(d) => {
                setSelectedInterval((interval) => {
                  const prevDay = sub(interval!.end, { days: 1 });
                  return {
                    end: interval!.end,
                    start: isAfter(d, prevDay) ? prevDay : d
                  };
                });
              }}
              selectedDay={selectedInterval.start}
              width={width}
            />
            <TimelineHeadR
              domain={dataDomain}
              xScaled={xScaled}
              onDayChange={(d) => {
                setSelectedInterval((interval) => {
                  const nextDay = add(interval!.start, { days: 1 });
                  return {
                    start: interval!.start,
                    end: isBefore(d, nextDay) ? nextDay : d
                  };
                });
              }}
              selectedDay={selectedInterval.end}
              width={width}
            />
            <TimelineRangeTrack
              range={selectedInterval}
              xScaled={xScaled}
              width={width}
            />
          </>
        )}

        <DateGrid width={width} xScaled={xScaled} />

        <TimelineContentInner ref={datasetsContainerRef}>
          <DatasetList
            datasets={datasets}
            width={width}
            xScaled={xScaled}
            selectedDay={selectedDay}
          />
        </TimelineContentInner>
      </TimelineContent>
    </TimelineWrapper>
  );
}

export default Timeline;

function DatasetList(props: any) {
  const { datasets, ...rest } = props;

  const [orderedDatasets, setOrderDatasets] = useState(datasets);

  useEffect(() => {
    setOrderDatasets(datasets);
  }, [datasets]);

  return (
    <Reorder.Group
      as={DatasetListSelf as any}
      axis='y'
      values={orderedDatasets}
      onReorder={setOrderDatasets}
    >
      {orderedDatasets.map((dataset) => (
        <DatasetListItem key={dataset.data.title} dataset={dataset} {...rest} />
      ))}
    </Reorder.Group>
  );
}
