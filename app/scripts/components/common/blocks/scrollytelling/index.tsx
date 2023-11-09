import React, {
  Children,
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
// Avoid error: node_modules/date-fns/esm/index.js does not export 'default'
import * as dateFns from 'date-fns';
import scrollama from 'scrollama';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Map as MapboxMap } from 'mapbox-gl';
import { CollecticonCircleXmark } from '@devseed-ui/collecticons';

import { BlockErrorBoundary } from '..';
import {
  chapterDisplayName,
  ChapterProps,
  ScrollyChapter,
  validateChapter
} from './chapter';
import {
  getLayerComponent,
  resolveConfigFunctions
} from '$components/common/mapbox/layers/utils';
import { AsyncDatasetLayer, useAsyncLayers } from '$context/layer-data';
import { userTzDate2utcString, utcString2userTzDate } from '$utils/date';
import { S_FAILED, S_SUCCEEDED } from '$utils/status';

import { SimpleMap } from '$components/common/mapbox/map';
import Hug from '$styles/hug';
import {
  LayerLegendContainer,
  LayerLegend
} from '$components/common/mapbox/layer-legend';
import MapMessage from '$components/common/mapbox/map-message';
import { MapLoading } from '$components/common/loading-skeleton';
import { HintedError } from '$utils/hinted-error';
import { formatSingleDate } from '$components/common/mapbox/utils';
import { convertProjectionToMapbox } from '$components/common/mapbox/map-options/utils';
import { useSlidingStickyHeaderProps } from '$components/common/layout-root';
import { HEADER_TRANSITION_DURATION } from '$utils/use-sliding-sticky-header';
import { Styles } from '$components/common/mapbox/layers/styles';
import { Basemap } from '$components/common/mapbox/layers/basemap';

type ResolvedLayer = {
  layer: Exclude<AsyncDatasetLayer['baseLayer']['data'], null>;
  Component: FunctionComponent<any> | null;
  runtimeData: { datetime?: Date; id: string };
} | null;

export const scrollyMapHeight = 'calc(100vh - 3rem)';

const ScrollyMapWrapper = styled.div``;

const TheMap = styled.div<{ topOffset: number }>`
  height: ${scrollyMapHeight};
  position: sticky;
  transition: top ${HEADER_TRANSITION_DURATION}ms ease-out,
    height ${HEADER_TRANSITION_DURATION}ms ease-out;

  ${({ topOffset }) => css`
    top: ${topOffset}px;
    height: calc(100vh - ${topOffset}px);
  `}
  .mapboxgl-canvas {
    height: 100%;
  }
`;

const TheChapters = styled(Hug)`
  position: relative;
  z-index: 2;
  pointer-events: none;
`;

/**
 * Get's the chapter props from the scrollytelling block's children.
 * Converts the props to the correct format. (like the datetime).
 *
 * @throws Error if any children is not a Chapter
 *
 * @param children ScrollytellingBlock children elements
 */
function useChapterPropsFromChildren(children): ScrollyChapter[] {
  return useMemo(() => {
    const chapters = Children.toArray(children) as ReactElement<
      ChapterProps,
      any
    >[];

    if (chapters.some((c) => c.type.displayName !== chapterDisplayName)) {
      throw new HintedError('Invalid ScrollytellingBlock children', [
        'You can only use <Chapter> inside <ScrollytellingBlock>'
      ]);
    }

    const chErrors = chapters.reduce<string[]>(
      (acc, ch, idx) => acc.concat(validateChapter(ch.props, idx)),
      []
    );

    if (chErrors.length) {
      throw new HintedError('Malformed ScrollytellingBlock Chapter', chErrors);
    }

    // Extract the props from the chapters.
    return chapters.map(
      (c) =>
        ({
          ...c.props,
          datetime: c.props.datetime
            ? utcString2userTzDate(c.props.datetime)
            : undefined
        } as unknown as ScrollyChapter)
    );
  }, [children]);
}

/**
 * Get a key that uniquely identifies the layer.
 *
 * @param ch The chapter
 * @returns string
 */
function getChapterLayerKey(ch: ScrollyChapter) {
  return `${ch.datasetId}-${ch.layerId}-${userTzDate2utcString(ch.datetime)}`;
}

/**
 *
 * @param {array} chList List of chapters
 */
function useMapLayersFromChapters(chList: ScrollyChapter[]) {
  // The layers are unique based on the dataset, layer id and datetime.
  // Filter out scrollytelling block that doesn't have layer first.
  const uniqueChapterLayers = useMemo(() => {
    const unique = chList
      .filter(({ showBaseMap }) => !showBaseMap)
      .reduce(
        (acc, ch) => acc.set(getChapterLayerKey(ch), ch),
        new Map<string, ScrollyChapter>()
      );
    return Array.from(unique.values());
  }, [chList]);

  // Create an array of datasetId & layerId to pass useAsyncLayers so that the
  // layers can be loaded. The skipCompare prevents the compare layer to be
  // loaded, since it will never be used.
  const uniqueLayerRefs = useMemo(() => {
    return uniqueChapterLayers.map(({ datasetId, layerId }) => ({
      datasetId,
      layerId,
      skipCompare: true
    }));
  }, [uniqueChapterLayers]);

  const asyncLayers = useAsyncLayers(uniqueLayerRefs);

  // Create a ref to cache each of the async layers.
  // After the async layer data is loaded from STAC, the layer functions have
  // to be resolved by the `resolveConfigFunctions`. This function will return a
  // new object every time causing useEffects that depend on this data to fire
  // multiple times, even though the data didn't actually change. An example of
  // this is the `sourceParams` in `MapLayerRasterTimeseries`.
  // Since the these values only have to be computed once, when the layer loads,
  // we can use this cache. On every hook run the asyncLayers.map below will
  // return the cached value if it exists or compute and cache.
  const resolvedLayersCache = useRef<ResolvedLayer[]>([]);

  // Each resolved layer will be an object with:
  // layer: The resolved layerData
  // Component: The component to render the layer
  // runtimeData: The runtime data for the layer
  //
  // The difference between runtimeData and layer is that the layer has the
  // layer definition data, the runtimeData belongs to the application and not
  // the layer. For example the datetime, results from a user action (picking
  // on the calendar or in this case setting it in the MDX).
  const resolvedLayers = useMemo(
    () =>
      asyncLayers.map(({ baseLayer }, index) => {
        if (baseLayer.status !== S_SUCCEEDED || !baseLayer.data) return null;

        if (resolvedLayersCache.current[index]) {
          return resolvedLayersCache.current[index];
        }

        // Some properties defined in the dataset layer config may be functions
        // that need to be resolved before rendering them. These functions accept
        // data to return the correct value. Include access to raw data.
        const datetime = uniqueChapterLayers[index].datetime;
        const bag = {
          datetime,
          dateFns,
          raw: baseLayer.data
        };
        const data = resolveConfigFunctions(baseLayer.data, bag);

        const resolved = {
          layer: data,
          Component: getLayerComponent(!!data.timeseries, data.type),
          runtimeData: {
            datetime,
            id: getChapterLayerKey(uniqueChapterLayers[index])
          }
        };

        // Need to set it as ResolvedLayer because the "resolveConfigFunctions"
        // is doing something weird to the tuples and converting something like
        // "center: [number, number]" to "center: number[]" which fails
        // validation.
        resolvedLayersCache.current[index] = resolved as ResolvedLayer;

        return resolved;
      }),
    [uniqueChapterLayers, asyncLayers]
  );

  const resolvedStatus = useMemo(
    () => asyncLayers.map(({ baseLayer }) => baseLayer.status),
    [asyncLayers]
  );

  return [resolvedLayers, resolvedStatus] as [
    typeof resolvedLayers,
    typeof resolvedStatus
  ];
}

/**
 * Returns a tuple of [areAllLayersAddedToTheMap, onLoadCb]. All layers will be
 * considered added when the onLoadCb is called `count` times with the
 * "succeeded" status.
 *
 * @param count Total count to reach.
 * @returns [areAllLayersAddedToTheMap, onLoadCb]
 */
function useAllLayersAdded(count): [boolean, (cb: { status: string }) => void] {
  const succeededCount = useRef(0);
  const [allAdded, setAdded] = useState(false);

  const onLoadCb = useCallback(
    ({ status }) => {
      if (status === S_SUCCEEDED && ++succeededCount.current >= count) {
        setAdded(true);
      }
    },
    [count]
  );

  return [allAdded, onLoadCb];
}

const mapOptions = {
  interactive: false,
  trackResize: true,
  center: [0, 0] as [number, number],
  zoom: 1
};

//
// Scrollytelling Block React Component
//
function Scrollytelling(props) {
  const { children } = props;

  const { isHeaderHidden, headerHeight, wrapperHeight } =
    useSlidingStickyHeaderProps();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap>(null);
  const [isMapLoaded, setMapLoaded] = useState(false);

  // Extract the props from the chapters.
  const chapterProps = useChapterPropsFromChildren(children);

  const [resolvedLayers, resolvedStatus] =
    useMapLayersFromChapters(chapterProps);
  const [activeChapter, setActiveChapter] = useState<ScrollyChapter | null>(
    null
  );

  // All layers must be loaded, resolved, and added to the map before we
  // initialize scrollama. This is needed because in a scrollytelling map we
  // need to preload everything so smooth transitions can be applied.
  const [areAllLayersLoaded, onLayerLoadSuccess] = useAllLayersAdded(
    resolvedLayers.length
  );

  useEffect(() => {
    if (!areAllLayersLoaded) return;

    // Setup initial map state which will be the values on the first chapter.
    const initialCh = chapterProps[0];
    mapRef.current?.setZoom(initialCh.zoom);
    mapRef.current?.setCenter(initialCh.center);

    setActiveChapter(initialCh);

    const scroller = scrollama();

    // setup the instance, pass callback functions
    scroller
      .setup({
        step: '[data-step]',
        offset: 0.8
        // ,debug: true
      })
      .onStepEnter((response) => {
        const { index } = response;

        const chapter = chapterProps[index];
        setActiveChapter(chapter);

        mapRef.current?.flyTo({
          center: chapter.center,
          zoom: chapter.zoom
        });

        const projection = chapter.projectionId
          ? {
              id: chapter.projectionId,
              center: chapter.projectionCenter,
              parallels: chapter.projectionParallels
            }
          : undefined;

        projection &&
          // @ts-expect-error setProjection is missing on type
          mapRef.current?.setProjection(convertProjectionToMapbox(projection));
      });

    return () => {
      scroller.destroy();
    };
  }, [chapterProps, areAllLayersLoaded]);

  const activeChapterLayerId =
    activeChapter &&
    !activeChapter.showBaseMap &&
    getChapterLayerKey(activeChapter);

  const activeChapterLayer = resolvedLayers.find(
    (resolvedLayer) => resolvedLayer?.runtimeData.id === activeChapterLayerId
  );

  const didFailLayerLoading = resolvedStatus.some((s) => s === S_FAILED);
  const areLayersLoading = !didFailLayerLoading && !areAllLayersLoaded;

  // The top offset for the scrollytelling element will depend on whether the
  // header is visible or not.
  const topOffset = isHeaderHidden
    ? // With the header hidden the offset is just the nav bar height.
      wrapperHeight - headerHeight
    : // Otherwise it's the full header height.
      wrapperHeight;

  return (
    <ScrollyMapWrapper>
      <TheMap topOffset={topOffset}>
        {areLayersLoading && <MapLoading />}

        {/*
          Map overlay element
          Map message for loading error
        */}
        <MapMessage
          id='scrolly-map-message'
          active={didFailLayerLoading}
          isInvalid
        >
          <CollecticonCircleXmark /> There was a problem loading the map data.
          Refresh the page and try again.
        </MapMessage>

        {/*
        Map overlay element
        Message shown with the current date.
      */}
        <MapMessage
          id='scrolly-map-date-message'
          active={!!activeChapterLayer?.runtimeData.datetime}
        >
          {activeChapterLayer?.runtimeData.datetime
            ? formatSingleDate(
                activeChapterLayer.runtimeData.datetime,
                activeChapterLayer.layer.timeseries.timeDensity
              )
            : null}
        </MapMessage>

        {/*
          Map overlay element
          Layer legend for the active layer.

          The SwitchTransition animated between 2 elements, so when there's no
          legend we use an empty div to ensure that there's an out animation.
          We also have to set the timeout to 1 because the empty div will not
          have transitions defined for it. This causes the transitionend
          listener to never fire leading to an infinite wait.
        */}
        <SwitchTransition>
          <CSSTransition
            key={activeChapterLayer?.layer.name}
            timeout={!activeChapterLayer ? 1 : undefined}
            addEndListener={(node, done) => {
              if (!activeChapterLayer) return;
              node?.addEventListener('transitionend', done, false);
            }}
            classNames='reveal'
          >
            {activeChapterLayer?.layer.legend ? (
              <LayerLegendContainer>
                <LayerLegend
                  id={`base-${activeChapterLayer.layer.id}`}
                  description={activeChapterLayer.layer.description}
                  title={activeChapterLayer.layer.name}
                  {...activeChapterLayer.layer.legend}
                />
              </LayerLegendContainer>
            ) : (
              <div />
            )}
          </CSSTransition>
        </SwitchTransition>

        <Styles>
          <Basemap />
          {isMapLoaded &&
            resolvedLayers.map((resolvedLayer, lIdx) => {
              if (!resolvedLayer || !mapRef.current) return null;

              const { runtimeData, Component: LayerCmp, layer } = resolvedLayer;
              const isHidden =
                !activeChapterLayerId ||
                activeChapterLayerId !== runtimeData.id ||
                activeChapter.showBaseMap;

              if (!LayerCmp) return null;

              // Each layer type is added to the map through a component. This
              // component has all the logic needed to add/update/remove the
              // layer. Which component to use will depend on the characteristics
              // of the layer and dataset.
              // The function getLayerComponent() should be used to get the
              // correct component.
              return (
                <LayerCmp
                  key={runtimeData.id}
                  id={runtimeData.id}
                  mapInstance={mapRef.current}
                  stacApiEndpoint={layer.stacApiEndpoint}
                  tileApiEndpoint={layer.tileApiEndpoint}
                  stacCol={layer.stacCol}
                  date={runtimeData.datetime}
                  sourceParams={layer.sourceParams}
                  zoomExtent={layer.zoomExtent}
                  onStatusChange={onLayerLoadSuccess}
                  idSuffix={'scrolly-' + lIdx}
                  isHidden={isHidden}
                />
              );
            })}
          <SimpleMap
            className='root'
            mapRef={mapRef}
            containerRef={mapContainer}
            onLoad={() => {
              setMapLoaded(true);
              // Fit the map to the container once  loaded.
              mapRef.current?.resize();
            }}
            mapOptions={mapOptions}
          />
        </Styles>
      </TheMap>
      <TheChapters>{children}</TheChapters>
    </ScrollyMapWrapper>
  );
}

Scrollytelling.propTypes = {
  children: T.node
};

export function ScrollytellingBlock(props) {
  return <BlockErrorBoundary {...props} childToRender={Scrollytelling} />;
}
