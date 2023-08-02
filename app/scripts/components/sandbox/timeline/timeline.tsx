import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import useDimensions from 'react-cool-dimensions';
import { Reorder } from 'framer-motion';
import { ZoomTransform, extent, scaleTime, select, zoom } from 'd3';
import {
  add,
  differenceInCalendarDays,
  format,
  isAfter,
  isBefore,
  startOfDay,
  sub
} from 'date-fns';
import { glsp, listReset, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonChevronDownSmall,
  CollecticonPlusSmall
} from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import { DatePicker } from '@devseed-ui/date-picker';

import { extraDataset, datasets as srcDatasets } from './datasets';
import { DatasetListItem } from './dataset-list-item';
import {
  TimelineHeadL,
  TimelineHeadP,
  TimelineHeadR,
  TimelineRangeTrack
} from './timeline-head';
import { DateAxis, DateGrid } from './date-axis';
import { RIGHT_AXIS_SPACE } from './constants';

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
  box-shadow: 1px 0 0 0 ${themeVal('color.base-200')};
  padding: ${glsp(0.5, 0.5, 0.5, 2)};
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
  const [datasets, setDatasets] = useState(srcDatasets);

  const dataDomain = useMemo(
    () => extent(datasets.flatMap((d) => d.domain)) as [Date, Date],
    [datasets]
  );

  const { observe, width: w, height } = useDimensions();
  const width = Math.max(1, w - RIGHT_AXIS_SPACE);

  const interactionRef = useRef<HTMLDivElement>(null);
  const datasetsContainerRef = useRef<HTMLDivElement>(null);

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const translateExtent = useMemo<[[number, number], [number, number]]>(
    () => [
      [0, 0],
      [width, height]
    ],
    [width, height]
  );

  const [selectedInterval, setSelectedInterval] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date('2020-03-03'),
    end: new Date('2020-08-03')
  });

  const [zoomTransform, setZoomTransform] = useState({
    x: 0,
    y: 0,
    k: 1
  });

  // Calculate min and max scale factors, such has each day has a minimum of 2px
  // and a maximum of 100px.
  const { k0, k1 } = useMemo(() => {
    if (width <= 0) return { k0: 0, k1: 1 };
    // Calculate how many days are in the domain.
    const domainDays = differenceInCalendarDays(dataDomain[1], dataDomain[0]);
    return {
      k0: Math.max(1, 2 / (width / domainDays)),
      k1: 100 / (width / domainDays)
    };
  }, [width, dataDomain]);

  const xMain = useMemo(() => {
    return scaleTime().domain(dataDomain).range([0, width]);
  }, [dataDomain, width]);

  const xScaled = useMemo(() => {
    return rescaleX(xMain, zoomTransform.x, zoomTransform.k);
  }, [xMain, zoomTransform.x, zoomTransform.k]);

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
  }, [translateExtent, k0, k1]);

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
        // Apply the delta to the x axis and then constrains according to the
        // zoom definition.
        const updatedT = new ZoomTransform(
          currentT.k,
          currentT.x - event.deltaX,
          currentT.y
        );
        const constrainFn = zoomBehavior.constrain();
        // Constrain the transform according to the timeline bounds.
        const newTransform = constrainFn(
          updatedT,
          translateExtent,
          zoomBehavior.translateExtent()
        );

        // Apply transform which will cause the zoom event to be emitted without
        // a sourceEvent.
        zoomBehavior.transform(element, newTransform);
      });
  }, [translateExtent, xScaled, zoomBehavior]);

  useEffect(() => {
    if (!interactionRef.current) return;

    // Get the current zoom transform.
    const element = select(interactionRef.current);
    const currentT = element.property('__zoom');

    // Programmatically update if different, meaning that it came from setting
    // the state.
    if (!isEqualTransform(currentT, zoomTransform)) {
      const { x, y, k } = zoomTransform;
      zoomBehavior.transform(element, new ZoomTransform(k, x, y));
    }
  }, [zoomBehavior, zoomTransform]);

  return (
    <TimelineWrapper>
      <InteractionRect ref={interactionRef} />
      <TimelineHeader>
        <TimelineDetails>
          <Headline>
            <Heading as='h2' size='xsmall'>
              Datasets
            </Heading>
            <Button
              variation='base-text'
              size='small'
              onClick={() => {
                setDatasets((list) =>
                  list.find((d) => d.title === 'Daily infinity!')
                    ? list.filter((d) => d.title !== 'Daily infinity!')
                    : [...list, extraDataset]
                );
              }}
            >
              <CollecticonPlusSmall meaningful title='Add dataset' />
            </Button>
          </Headline>
          <p>X of Y</p>
        </TimelineDetails>
        <TimelineControls ref={observe}>
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
              value={selectedInterval}
              onConfirm={(d) => {
                setSelectedInterval(d);
              }}
              isClearable={false}
              isRange
              alignment='right'
              renderTriggerElement={(props) => (
                <DatePickerButton {...props} size='small'>
                  <span className='head-reference'>L</span>
                  <span>{format(selectedInterval.start, 'MMM do, yyyy')}</span>
                  <span className='head-reference'>R</span>
                  <span>{format(selectedInterval.end, 'MMM do, yyyy')}</span>
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
            setSelectedDay={setSelectedDay}
            selectedDay={selectedDay}
            width={width}
          />
        ) : (
          false
        )}
        <TimelineHeadL
          domain={dataDomain}
          xScaled={xScaled}
          setSelectedDay={(d) => {
            setSelectedInterval((interval) => {
              const prevDay = sub(interval.end, { days: 1 });
              return {
                ...interval,
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
          setSelectedDay={(d) => {
            setSelectedInterval((interval) => {
              const nextDay = add(interval.start, { days: 1 });
              return {
                ...interval,
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
        <DatasetListItem key={dataset.title} dataset={dataset} {...rest} />
      ))}
    </Reorder.Group>
  );
}

/**
 * Rescales the given scale according to the given factors.
 *
 * @param scale Scale to rescale
 * @param x X factor
 * @param k Scale factor
 * @returns New scale
 */
function rescaleX(scale, x, k) {
  const range = scale.range();
  return scale.copy().domain(
    range.map((v) => {
      // New value after scaling
      const value = (v - x) / k;
      // Clamp value to the range
      const valueClamped = Math.max(range[0], Math.min(value, range[1]));
      return scale.invert(valueClamped);
    })
  );
}

interface Transform {
  x: number;
  y: number;
  k: number;
}

/**
 * Compares two transforms.
 *
 * @param t1 First transform
 * @param t2 Second transform
 * @returns Whether the transforms are equal.
 */
function isEqualTransform(t1: Transform, t2: Transform) {
  return t1.x === t2.x && t1.y === t2.y && t1.k === t2.k;
}
