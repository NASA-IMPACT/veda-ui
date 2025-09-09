import { themeVal } from '@devseed-ui/theme-provider';
import { select, zoom } from 'd3';
import add from 'date-fns/add';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import max from 'date-fns/max';
import sub from 'date-fns/sub';
import startOfDay from 'date-fns/startOfDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import { useAtom, useSetAtom } from 'jotai';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import useDimensions from 'react-cool-dimensions';
import styled from 'styled-components';
import {
  applyTransform,
  getLabelFormat,
  getTemporalExtent,
  isEqualTransform,
  rescaleX
} from '../timeline/timeline-utils';
import { TimelineControls } from '../timeline/timeline-controls';
import { DatasetTimelineItem } from './dataset-item';
import {
  timelineWidthAtom,
  zoomTransformAtom
} from '$components/exploration/atoms/timeline';
import { usePreviousValue } from '$utils/use-effect-previous';
import { TimelineDatasetSuccess } from '$components/exploration/types.d.ts';
import { getLowestCommonTimeDensity } from '$components/exploration/data-utils';

const TimelineWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  height: 100%;

  svg {
    display: block;
  }
`;

const InteractionRect = styled.div`
  position: absolute;
  /* background-color: rgba(255, 0, 0, 0.08); */
  box-shadow: 1px 0 0 0 ${themeVal('color.base-200')},
    inset 1px 0 0 0 ${themeVal('color.base-200')};
  z-index: 100;
`;

const TimelineHeader = styled.header`
  display: flex;
  flex-shrink: 0;
  box-shadow: 0 1px 0 0 ${themeVal('color.base-200')};
  background-color: ${themeVal('color.base-50')};
`;

const TimelineContent = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  width: 100%;
  position: relative;
`;

const EmptyTimelineContentInner = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  overflow-x: hidden;
  position: relative;
`;

const TimelineContentInner = styled(EmptyTimelineContentInner)<{
  panelHeight: number;
}>`
  overflow-y: scroll;
  /* @TECH-DEBT: A hack to target only Safari
     Safari needs a specific height to make the contents  scrollable */
  @supports (font: -apple-system-body) and (-webkit-appearance: none) {
    height: calc(${(props) => 100 - props.panelHeight}vh - 130px);
  }
`;

interface TimelineProps {
  dataset: TimelineDatasetSuccess;
  selectedDay: Date | null;
  setSelectedDay: (d: Date | null) => void;
  selectedCompareDay: Date | null;
  setSelectedCompareDay: (d: Date | null) => void;
  panelHeight: number;
  selectedInterval: { start: Date; end: Date } | null;
  setSelectedInterval: (interval: any) => void;
  dataDomain: any;
  setObsolete: () => void;
  scaleFactors: { k0: number; k1: number };
  xScaled: any;
  xMain: any;
}

const getIntervalFromDate = (selectedDay: Date, dataDomain: [Date, Date]) => {
  const startDate = sub(selectedDay, { months: 2 });
  const endDate = add(selectedDay, { months: 2 });

  // Set start and end days from the selected day, if able.
  const [start, end] = dataDomain;
  return {
    start: isAfter(startDate, start) ? startDate : selectedDay,
    end: isBefore(endDate, end) ? endDate : end
  };
};

export interface TimelineHead {
  name: 'Point' | 'PointCompare' | 'In' | 'Out';
  date: Date;
  ref?: React.MutableRefObject<any>;
  isInView?: boolean;
  outDirection?: 'left' | 'right' | undefined;
}

export default function TimelineSingle(props: TimelineProps) {
  const {
    dataset,
    selectedDay,
    setSelectedDay,
    selectedCompareDay,
    setSelectedCompareDay,
    panelHeight,
    selectedInterval,
    setSelectedInterval,
    dataDomain,
    setObsolete,
    scaleFactors,
    xScaled,
    xMain
  } = props;

  // Refs for non react based interactions.
  // The interaction rect is used to capture the different d3 events for the
  // zoom.
  const interactionRef = useRef<HTMLDivElement>(null);
  // Because the interaction rect traps the events, we need a ref to the
  // container to propagate the needed events to it, like scroll.
  const datasetsContainerRef = useRef<HTMLDivElement>(null);

  const headPointRef = useRef(null);
  const headPointCompareRef = useRef(null);
  const headInRef = useRef(null);
  const headOutRef = useRef(null);

  const [outOfViewHeads, setOutOfViewHeads] = useState<TimelineHead[]>([]);

  // Observe the width of the timeline wrapper and store it.
  // We then use hooks to get the different needed values.
  const setTimelineWidth = useSetAtom(timelineWidthAtom);
  const { observe } = useDimensions({
    onResize: ({ width }) => {
      setTimelineWidth(width);
    }
  });

  const width = 800;
  const [_, setZoomTransform] = useAtom(zoomTransformAtom);

  useEffect(() => {
    // Set the analysis as obsolete when the selected interval changes.
    setObsolete();
  }, [setObsolete, selectedInterval]);

  const translateExtent = useMemo<[[number, number], [number, number]]>(
    () => [
      [0, 0],
      [width, 0]
    ],
    [width]
  );

  // Calculate min and max scale factors, such has each day has a minimum of 2px
  // and a maximum of 100px.
  const { k0, k1 } = scaleFactors;

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
    if (!xScaled) return;

    // Get the start and end of the current scaled domain (visible timeline)
    const [extentStart, extentEnd] = xScaled.domain();

    // Initialize the heads array with the selected day point
    let heads: {
      name: 'Point' | 'PointCompare' | 'In' | 'Out';
      ref: React.MutableRefObject<any>;
      date: Date | null;
    }[] = [{ name: 'Point', ref: headPointRef, date: selectedDay }];

    // If there is a selected compare day, add it to the heads array
    if (selectedCompareDay) {
      heads = [
        ...heads,
        {
          name: 'PointCompare',
          ref: headPointCompareRef,
          date: selectedCompareDay
        }
      ];
    }

    // If there is a selected interval, add its start and end to the heads array
    if (selectedInterval) {
      heads = [
        ...heads,
        { name: 'In', ref: headInRef, date: selectedInterval.start },
        { name: 'Out', ref: headOutRef, date: selectedInterval.end }
      ];
    }

    // Filter heads that are not currently in view and map them to the OutOfViewHead type
    const outOfViewHeads: TimelineHead[] = heads
      .filter((head) => !head.ref.current)
      .map((head) => {
        let outDirection: 'left' | 'right' | undefined;
        if (head.date && head.date < extentStart) {
          outDirection = 'left';
        } else if (head.date && head.date > extentEnd) {
          outDirection = 'right';
        }

        return {
          name: head.name,
          // Default to current date if date is null (e.g. could occur on initial component mount)
          date: head.date ?? new Date(),
          isInView: false,
          outDirection
        };
      });

    setOutOfViewHeads(outOfViewHeads);
  }, [
    selectedDay,
    selectedInterval,
    selectedCompareDay,
    xScaled,
    zoomBehavior
  ]);

  useEffect(() => {
    if (!interactionRef.current) return;

    select(interactionRef.current)
      .call(zoomBehavior)
      .on('dblclick.zoom', null)
      .on('click', (event) => {
        const d = xScaled?.invert(event.layerX);
        if (!d) return;

        // TODO: Key click has to be improved! Fixes needed:
        // - Preventing setting start day after end day and vice versa.
        // - Handling when there's no selected interval.
        if (event.shiftKey) {
          setSelectedInterval((interval) =>
            interval ? { ...interval, start: d } : null
          );
        } else if (event.altKey) {
          setSelectedInterval((interval) =>
            interval ? { ...interval, end: d } : null
          );
        } else {
          setSelectedDay(startOfDay(d));
        }
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

  const onControlsZoom = useCallback(
    (zoomV) => {
      if (!interactionRef.current || !xMain || !xScaled || !selectedDay) return;

      // Position in the timeline so it maintains the same position.
      const currPlayheadX = xScaled(selectedDay);
      // Rescale the main scale to be able to calculate the new x position
      const rescaled = rescaleX(xMain, 0, zoomV);

      applyTransform(
        zoomBehavior,
        select(interactionRef.current),
        rescaled(selectedDay) * -1 + currPlayheadX,
        0,
        zoomV
      );
    },
    [xScaled, xMain, selectedDay, zoomBehavior]
  );

  // Set correct dates when the date domain changes.
  const prevDataDomain = usePreviousValue(dataDomain);
  useEffect(() => {
    if (prevDataDomain === dataDomain) return;

    // If all datasets are removed, reset the selected day/interval.
    if (!dataDomain) {
      setSelectedDay(null);
      setSelectedInterval(null);
      return;
    }

    const [start, end] = dataDomain;
    // If the selected day is not within the new domain, set it to the last
    // available dataset date. We can't use the date domain, because the end of
    // the domain is the max date + a duration so that all dataset dates fit in
    // the timeline.
    let newSelectedDay; // needed for the interval
    if (!selectedDay || !isWithinInterval(selectedDay, { start, end })) {
      const maxDate = max(
        // successDatasets.map((d) => d.data.domain.last) as Date[]
        [dataset.data?.domain?.last as Date]
      );
      setSelectedDay(maxDate);
      newSelectedDay = maxDate;
    } else {
      newSelectedDay = selectedDay;
    }

    // If there is a selected interval and  is not within the new domain,
    // calculate a new one.
    if (
      selectedInterval &&
      (!isWithinInterval(selectedInterval.start, { start, end }) ||
        !isWithinInterval(selectedInterval.end, { start, end }))
    ) {
      setSelectedInterval(getIntervalFromDate(newSelectedDay, dataDomain));
    }
  }, [
    prevDataDomain,
    dataDomain,
    setSelectedDay,
    setSelectedInterval,
    selectedDay,
    selectedInterval
  ]);

  const shouldRenderTimeline = xScaled && dataDomain;

  const minMaxTemporalExtent = useMemo(
    () => getTemporalExtent([dataset]),
    [dataset]
  );

  const lowestCommonTimeDensity = useMemo(
    () => getLowestCommonTimeDensity([dataset]),
    [dataset]
  );

  const timelineLabelFormat = useMemo(
    () => getLabelFormat(lowestCommonTimeDensity),
    [lowestCommonTimeDensity]
  );

  return (
    <TimelineWrapper ref={observe}>
      <InteractionRect
        ref={interactionRef}
        style={!shouldRenderTimeline ? { pointerEvents: 'none' } : undefined}
        data-tour='timeline-interaction-rect'
      />
      <TimelineHeader>
        <TimelineControls
          minMaxTemporalExtent={minMaxTemporalExtent}
          xScaled={xScaled}
          width={width}
          fullWidth={false}
          onZoom={onControlsZoom}
          outOfViewHeads={outOfViewHeads}
          timeDensity={lowestCommonTimeDensity}
          timelineLabelsFormat={timelineLabelFormat}
        />
      </TimelineHeader>
      <TimelineContent>
        <TimelineContentInner
          ref={datasetsContainerRef}
          panelHeight={panelHeight}
        >
          <DatasetTimelineItem
            key={dataset.data.id}
            dataset={dataset}
            width={width}
            xScaled={xScaled}
          />
        </TimelineContentInner>
      </TimelineContent>
    </TimelineWrapper>
  );
}
