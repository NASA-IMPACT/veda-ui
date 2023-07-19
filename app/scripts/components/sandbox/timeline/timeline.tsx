import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import useDimensions from 'react-cool-dimensions';
import { Reorder } from 'framer-motion';
import { ZoomTransform, axisBottom, extent, scaleTime, select, zoom } from 'd3';
import { add, format, isAfter, isBefore, startOfDay, sub } from 'date-fns';
import { glsp, listReset, themeVal } from '@devseed-ui/theme-provider';
import { CollecticonChevronDownSmall, CollecticonPlusSmall } from '@devseed-ui/collecticons';
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
  inset: 0;
  left: 20rem;
  top: 3.5rem;
  /* background-color: rgba(255, 0, 0, 0.08); */
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

const GridSvg = styled.svg`
  position: absolute;
  right: 0;
  height: 100%;
  pointer-events: none;
`;

function Timeline() {
  const [datasets, setDatasets] = useState(srcDatasets);

  const { observe, width, height } = useDimensions();

  const interactionRef = useRef<HTMLDivElement>(null);
  const axisSvgRef = useRef<SVGSVGElement>(null);
  const datasetsContainerRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

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

  const dataDomain = useMemo(
    () => extent(datasets.flatMap((d) => d.domain)) as [Date, Date],
    [datasets]
  );

  const domainDays = useMemo(
    () => (dataDomain[1].getTime() - dataDomain[0].getTime()) / 86400000,
    [dataDomain]
  );

  const xMain = useMemo(() => {
    return scaleTime().domain(dataDomain).range([0, width]);
  }, [dataDomain, width]);

  const xScaled = useMemo(() => {
    return rescaleX(xMain, zoomTransform.x, zoomTransform.k);
  }, [xMain, zoomTransform.x, zoomTransform.k]);

  const xAxis = useMemo(() => {
    return xScaled ? axisBottom(xScaled) : undefined;
  }, [xScaled]);

  const zoomBehavior = useMemo(() => {
    return (
      zoom()
        // Make the maximum zoom level as such as each day has maximum of 100px.
        .scaleExtent([1, 100 / (width / domainDays)])
        .translateExtent([
          [0, 0],
          [width, height]
        ])
        .extent([
          [0, 0],
          [width, height]
        ])
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
        })
    );
  }, [width, height, domainDays]);

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
          [
            [0, 0],
            [width, height]
          ],
          zoomBehavior.translateExtent()
        );

        // Apply transform which will cause the zoom event to be emitted without
        // a sourceEvent.
        zoomBehavior.transform(element, newTransform);
      });
  }, [width, height, xScaled, zoomBehavior]);

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

  useEffect(() => {
    if (!xAxis) return;
    select(axisSvgRef.current).select<SVGGElement>('.x.axis').call(xAxis);
  }, [xAxis]);

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
                  list.length === srcDatasets.length
                    ? list.concat(extraDataset)
                    : list.slice(0, -1)
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

          <svg className='date-axis' ref={axisSvgRef} width={width} height={32}>
            <g className='x axis' />
          </svg>
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

        {xScaled ? (
          <GridSvg width={width}>
            {xScaled.ticks().map((tick) => (
              <line
                stroke={theme.color?.['base-200']}
                key={tick.getTime()}
                x1={xScaled(tick)}
                y1='0%'
                x2={xScaled(tick)}
                y2='100%'
              />
            ))}
          </GridSvg>
        ) : null}
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
 * @param scale Scale to rescale
 * @param x X factor
 * @param k Scale factor
 * @returns new scale
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

function isEqualTransform(t1, t2) {
  return t1.x === t2.x && t1.y === t2.y && t1.k === t2.k;
}
