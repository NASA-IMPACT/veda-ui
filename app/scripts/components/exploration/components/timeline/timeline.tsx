import { Button } from '@devseed-ui/button';
import {
  CollecticonIsoStack,
  CollecticonPlusSmall
} from '@devseed-ui/collecticons';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { select, zoom } from 'd3';
import {
  add,
  isAfter,
  isBefore,
  isWithinInterval,
  max,
  sub
} from 'date-fns';
import startOfDay from 'date-fns/startOfDay';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import useDimensions from 'react-cool-dimensions';
import styled from 'styled-components';

import { DatasetList } from '../datasets/dataset-list';

import { applyTransform, getLabelFormat, getTemporalExtent, isEqualTransform, rescaleX } from './timeline-utils';
import {
  TimelineControls,
  getInitialScale,
  TimelineDateAxis,
} from './timeline-controls';
import {
  TimelineHeadIn,
  TimelineHeadPoint,
  TimelineHeadOut,
  TimelineRangeTrack
} from './timeline-head';
import { DateGrid } from './date-axis';

import { selectedIntervalAtom } from '$components/exploration/atoms/dates';
import {
  timelineSizesAtom,
  timelineWidthAtom,
  zoomTransformAtom
} from '$components/exploration/atoms/timeline';
import { useTimelineDatasetsDomain } from '$components/exploration/atoms/hooks';
import { RIGHT_AXIS_SPACE } from '$components/exploration/constants';
import {
  useLayoutEffectPrevious,
  usePreviousValue
} from '$utils/use-effect-previous';
import {
  useScaleFactors,
  useScales
} from '$components/exploration/hooks/scales-hooks';
import { useOnTOIZoom } from '$components/exploration/hooks/use-toi-zoom';
import {
  TimelineDataset,
  DatasetStatus,
  TimelineDatasetSuccess,
  ZoomTransformPlain
} from '$components/exploration/types.d.ts';
import { useInteractionRectHover } from '$components/exploration/hooks/use-dataset-hover';
import { useAnalysisController } from '$components/exploration/hooks/use-analysis-data-request';
import useAois from '$components/common/map/controls/hooks/use-aois';
import Pluralize from '$utils/pluralize';
import { getLowestCommonTimeDensity } from '$components/exploration/data-utils-no-faux-module';

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

const TimelineDetails = styled.div`
  width: 20rem;
  flex-shrink: 0;
  box-shadow: 1px 0 0 0 ${themeVal('color.base-200')},
    0 1px 0 0 ${themeVal('color.base-200')};
  padding: ${glsp(1.75, 1, 0, 2)};
  z-index: 1;
`;

const Headline = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  width: 100%;
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

const LayerActionBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  svg {
    fill: ${themeVal('color.base-300')};
  }
`;
const TimelineHeading = styled(Heading)`
  font-size: 0.875rem;
`;

interface TimelineProps {
  datasets: TimelineDataset[];
  selectedDay: Date | null;
  setSelectedDay: (d: Date | null) => void;
  selectedCompareDay: Date | null;
  setSelectedCompareDay: (d: Date | null) => void;
  onDatasetAddClick?: () => void;
  panelHeight: number;
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

export default function Timeline(props: TimelineProps) {
  const {
    datasets,
    selectedDay,
    setSelectedDay,
    selectedCompareDay,
    setSelectedCompareDay,
    onDatasetAddClick,
    panelHeight
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

  const [selectedInterval, setSelectedInterval] = useAtom(selectedIntervalAtom);

  const { setObsolete, runAnalysis, isAnalyzing } = useAnalysisController();
  const [zoomTransform, setZoomTransform] = useAtom(zoomTransformAtom);
  const { features } = useAois();

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
    if (!xScaled) return;

    // Get the start and end of the current scaled domain (visible timeline)
    const [extentStart, extentEnd] = xScaled.domain();

    // Initialize the heads array with the selected day point
    let heads: { name: 'Point' | 'PointCompare' | 'In' | 'Out'; ref: React.MutableRefObject<any>; date: Date | null }[] = [
      { name: 'Point', ref: headPointRef, date: selectedDay }
    ];

    // If there is a selected compare day, add it to the heads array
    if (selectedCompareDay) {
      heads = [
        ...heads,
        { name: 'PointCompare', ref: headPointCompareRef, date: selectedCompareDay }
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
      .filter(head => !head.ref.current)
      .map(head => {
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

  }, [selectedDay, selectedInterval, selectedCompareDay, xScaled, zoomBehavior]);


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

  // When a new dataset is added we need to recompute the transform to ensure
  // the timeline view remains the same. Datasets being added cause the scale
  // factors to change.
  // Using useLayoutEffect to ensure the transform is calculate before new
  // renders.
  useLayoutEffectPrevious<
    [number, ZoomTransformPlain, typeof xScaled, typeof xMain, number]
  >(
    ([_k1, _zoomTransform, _xScaled]) => {
      if (
        !interactionRef.current ||
        !_zoomTransform ||
        !_k1 ||
        !_xScaled ||
        !xMain ||
        _k1 === k1
      )
        return;

      // Calculate the new scale factor by using the ration between the old
      // and new scale extents. Can never be less than minimum scale factor (k0)
      const k = Math.max(k0, (k1 / _k1) * _zoomTransform.k);
      // Rescale the main scale to be able to calculate the new x position
      const rescaled = rescaleX(xMain, 0, k);
      // The date at the start of the timeline is the initial domain of the
      // scale used to draw it - the scaled scale in this case.
      const dateAtTimelineStart = _xScaled.domain()[0];

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
    },
    [k1, zoomTransform, xScaled, xMain, k0]
  );

  const successDatasets = useMemo(
    () =>
      datasets.filter(
        (d): d is TimelineDatasetSuccess =>
          d.status === DatasetStatus.SUCCESS
      ),
    [datasets]
  );

  // When a loaded dataset is added from an empty state, compute the correct
  // transform taking into account the min scale factor (k0).
  const successDatasetsCount = successDatasets.length;
  const prevSuccessDatasetsCount = usePreviousValue(successDatasets.length);
  useLayoutEffect(() => {
    if (
      !interactionRef.current ||
      prevSuccessDatasetsCount !== 0 ||
      successDatasetsCount === 0
    )
      return;

    applyTransform(zoomBehavior, select(interactionRef.current), 0, 0, k0);
  }, [prevSuccessDatasetsCount, successDatasetsCount, k0, zoomBehavior]);

  const { initializeTOIZoom } = useOnTOIZoom();

  useEffect(() => {
    // Set TOIZoom functionality in atom so it can be used in analysis component
    // Ensure zoomBehavior and interactionRef are defined before initializing
    if (zoomBehavior && interactionRef.current) {
      initializeTOIZoom(zoomBehavior, interactionRef);
    }
  }, [initializeTOIZoom, zoomBehavior, interactionRef]);

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
      const maxDate = max(successDatasets.map((d) => d.data.domain.last) as Date[]);
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
    selectedInterval,
    successDatasets
  ]);

  // When new datasets are added, if we're in analysis mode, run the analysis
  // for them
  const currentSuccessDatasetsIds = useMemo(
    () => successDatasets.map((d) => d.data.id),
    [successDatasets]
  );
  const prevSuccessDatasetsIds = usePreviousValue(currentSuccessDatasetsIds);
  useEffect(() => {
    if (!isAnalyzing) return;
    // Get the ids of the datasets that were added.
    const addedDatasets = currentSuccessDatasetsIds.filter(
      (id) => !prevSuccessDatasetsIds?.includes(id)
    );

    if (addedDatasets.length) {
      runAnalysis(addedDatasets);
    }
  }, [
    prevSuccessDatasetsIds,
    currentSuccessDatasetsIds,
    isAnalyzing,
    runAnalysis
  ]);

  // Set a date range selection when the user creates a new AOI.
  const prevFeaturesCount = usePreviousValue(features.length);
  useEffect(() => {
    // If no feature change, no selected day, or no domain, skip.
    if (prevFeaturesCount === features.length || !selectedDay || !dataDomain)
      return;

    if (!features.length) {
      // All features were removed. Reset the selected day/interval.
      setSelectedInterval(null);
    }

    if (prevFeaturesCount === 0 && features.length > 0) {
      // We went from 0 features to some features.
      setSelectedInterval(getIntervalFromDate(selectedDay, dataDomain));
    }
  }, [
    features.length,
    prevFeaturesCount,
    selectedDay,
    dataDomain,
    setSelectedInterval
  ]);

  // Catches the situation where the user drawn an aoi before the dataset has
  // time to finish loading.
  const prevSelectedDay = usePreviousValue(selectedDay);
  useEffect(() => {
    if (
      selectedDay &&
      !prevSelectedDay &&
      features.length &&
      dataDomain &&
      !selectedInterval
    ) {
      setSelectedInterval(getIntervalFromDate(selectedDay, dataDomain));
    }
  }, [
    selectedDay,
    prevSelectedDay,
    features.length,
    selectedInterval,
    dataDomain,
    setSelectedInterval
  ]);

  const shouldRenderTimeline = xScaled && dataDomain;

  // Attach the needed event listeners to the interaction rectangle to capture
  // the mouse position. See source file for more information.
  useInteractionRectHover(interactionRef.current);
  const CommonTimelineHeadline = () => {
    return (
      <Headline>
        <TimelineHeading as='h2'>Data layers</TimelineHeading>
        {
          onDatasetAddClick && (
            <Button
              variation='primary-fill'
              size='small'
              onClick={onDatasetAddClick}
            >
              <CollecticonPlusSmall title='Add layer' /> Add layer
            </Button>
          )
        }
      </Headline>
    );
  };
  // Stub scale for when there is no layers
  // const initialScale = useMemo(() => getInitialScale(width), [width]);

  const minMaxTemporalExtent = useMemo(
    () => getTemporalExtent(
      // Filter the datasets to only include those with status 'SUCCESS'.
      datasets.filter((dataset): dataset is TimelineDatasetSuccess => dataset.status === DatasetStatus.SUCCESS)
    ),
    [datasets]
  );

  const lowestCommonTimeDensity = useMemo(
    () =>
      getLowestCommonTimeDensity(
        // Filter the datasets to only include those with status 'SUCCESS'.
        // The function getLowestCommonTimeDensity expects an array of TimelineDatasetSuccess objects,
        // which have the 'data.timeDensity' property (formated as such).
        datasets.filter((dataset): dataset is TimelineDatasetSuccess => dataset.status === DatasetStatus.SUCCESS)
      ),
    [datasets]
  );

  const timelineLabelFormat = useMemo(
    () => getLabelFormat(lowestCommonTimeDensity),
    [lowestCommonTimeDensity]
  );

  // Some of these values depend on each other, but we check all of them so
  // typescript doesn't complain.
  if (datasets.length === 0) {
    return (
      <TimelineWrapper ref={observe}>
        <TimelineHeader>
          <TimelineDetails>{CommonTimelineHeadline()}</TimelineDetails>
          {/* <TimelineDateAxis xScaled={initialScale} width={width} /> */}
        </TimelineHeader>
        <TimelineContent>
          <TimelineDetails />
          <EmptyTimelineContentInner>
            {/* <DateGrid width={width} xScaled={initialScale} /> */}
            <LayerActionBox>
              <div>
                <CollecticonIsoStack size='xxlarge' />
                <p>No data layer added to the map!</p>
                {
                  onDatasetAddClick && (
                    <Button
                      variation='base-text'
                      size='small'
                      onClick={onDatasetAddClick}
                    >
                      Add a layer here
                    </Button>
                  )
                }
              </div>
            </LayerActionBox>
          </EmptyTimelineContentInner>
        </TimelineContent>
      </TimelineWrapper>
    );
  }

  return (
    <TimelineWrapper ref={observe}>
      <InteractionRect
        ref={interactionRef}
        style={!shouldRenderTimeline ? { pointerEvents: 'none' } : undefined}
        data-tour='timeline-interaction-rect'
      />
      <TimelineHeader>
        <TimelineDetails>
          {CommonTimelineHeadline()}
          <small>
            <Pluralize
              count={datasets.length}
              singular='layer'
              plural='layers'
            />{' '}
            added
          </small>
        </TimelineDetails>
        <TimelineControls
          minMaxTemporalExtent={minMaxTemporalExtent}
          xScaled={xScaled}
          width={width}
          onZoom={onControlsZoom}
          outOfViewHeads={outOfViewHeads}
          timeDensity={lowestCommonTimeDensity}
          timelineLabelsFormat={timelineLabelFormat}
        />
      </TimelineHeader>
      <TimelineContent>
        {shouldRenderTimeline && (
          <>
            {selectedDay && (
              <TimelineHeadPoint
                ref={headPointRef}
                data-tour='timeline-head-a'
                label={selectedCompareDay ? 'A' : undefined}
                domain={dataDomain}
                xScaled={xScaled}
                onDayChange={setSelectedDay}
                selectedDay={selectedDay}
                width={width}
                labelFormat={timelineLabelFormat}
              />
            )}
            {selectedCompareDay && (
              <TimelineHeadPoint
                ref={headPointCompareRef}
                label='B'
                domain={dataDomain}
                xScaled={xScaled}
                onDayChange={setSelectedCompareDay}
                selectedDay={selectedCompareDay}
                width={width}
                labelFormat={timelineLabelFormat}
              />
            )}
            {selectedInterval && (
              <>
                <TimelineHeadIn
                  ref={headInRef}
                  domain={dataDomain}
                  xScaled={xScaled}
                  label='FROM'
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
                  labelFormat={timelineLabelFormat}
                />
                <TimelineHeadOut
                  ref={headOutRef}
                  domain={dataDomain}
                  xScaled={xScaled}
                  label='TO'
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
                  labelFormat={timelineLabelFormat}
                />
                <TimelineRangeTrack
                  range={selectedInterval}
                  xScaled={xScaled}
                  width={width}
                />
              </>
            )}

            <DateGrid width={width} xScaled={xScaled} />
          </>
        )}

        <TimelineContentInner
          ref={datasetsContainerRef}
          panelHeight={panelHeight}
        >
          <DatasetList width={width} xScaled={xScaled} />
        </TimelineContentInner>
      </TimelineContent>
    </TimelineWrapper>
  );
}
