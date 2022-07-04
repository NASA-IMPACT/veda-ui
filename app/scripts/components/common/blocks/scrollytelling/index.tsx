import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import * as dateFns from 'date-fns';
import scrollama from 'scrollama';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { CollecticonCircleXmark } from '@devseed-ui/collecticons';
import { media } from '@devseed-ui/theme-provider';

import {
  getLayerComponent,
  resolveConfigFunctions
} from '$components/common/mapbox/layers/utils';
import { AsyncDatasetLayer, useAsyncLayers } from '$context/layer-data';
import { userTzDate2utcString, utcString2userTzDate } from '$utils/date';
import { S_FAILED, S_SUCCEEDED } from '$utils/status';

import { SimpleMap } from '$components/common/mapbox/map';
import Hug from '$styles/hug';
import LayerLegend from '$components/common/mapbox/layer-legend';
import MapMessage from '$components/common/mapbox/map-message';
import {
  chapterDisplayName,
  ChapterProps,
  ScrollyChapter,
  validateChapter
} from './chapter';
import { MapLoading } from '$components/common/loading-skeleton';
import { HintedError } from '$utils/hinted-error';
import { BlockErrorBoundary } from '..';
import { formatSingleDate } from '$components/common/mapbox/utils';

type ResolvedLayer = {
  layer: Exclude<AsyncDatasetLayer['baseLayer']['data'], null>;
  Component: React.FunctionComponent<any> | null;
  runtimeData: { datetime?: Date; id: string };
} | null;

export const scrollyMapHeight = 'calc(100vh - 3rem)';

const ScrollyMapWrapper = styled.div``;

const TheMap = styled.div`
  height: ${scrollyMapHeight};
  position: sticky;
  top: 3rem;

  ${media.mediumUp`
    height: calc(100vh - 4rem);
    top: 4rem;
  `}
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
    const chapters = React.Children.toArray(children) as React.ReactElement<
      ChapterProps,
      any
    >[];

    if (chapters.some((c) => c.type.displayName !== chapterDisplayName)) {
      throw new HintedError('Invalid ScrollytellingBlock children', [
        'You can only use <Chapter> inside <ScrollytellingBlock>'
      ]);
    }

    const chErrors = chapters.reduce(
      (acc, ch, idx) => acc.concat(validateChapter(ch.props, idx)),
      [] as string[]
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
        if (baseLayer?.status !== S_SUCCEEDED || !baseLayer.data) return null;

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

        resolvedLayersCache.current[index] = resolved;

        return resolved;
      }),
    [uniqueChapterLayers, asyncLayers]
  );

  const resolvedStatus = useMemo(
    () => asyncLayers.map(({ baseLayer }) => baseLayer?.status),
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
  style: process.env.MAPBOX_STYLE_URL,
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

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>(null);
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
        step: '[data-step]'
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

        const projection = chapter.projectionName
          ? {
              name: chapter.projectionName,
              center: chapter.projectionCenter,
              parallels: chapter.projectionParallels
            }
          : undefined;

        projection && mapRef.current?.setProjection(projection);
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

  return (
    <ScrollyMapWrapper>
      <TheMap>
        {isMapLoaded &&
          resolvedLayers.map((resolvedLayer) => {
            if (!resolvedLayer) return null;

            const { runtimeData, Component: LayerCmp, layer } = resolvedLayer;

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
                stacCol={layer.stacCol}
                date={runtimeData.datetime}
                sourceParams={layer.sourceParams}
                zoomExtent={layer.zoomExtent}
                onStatusChange={onLayerLoadSuccess}
                isHidden={
                  !activeChapterLayerId ||
                  activeChapterLayerId !== runtimeData.id ||
                  activeChapter.showBaseMap
                }
              />
            );
          })}

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
                activeChapterLayer?.runtimeData.datetime,
                activeChapterLayer?.layer.timeseries.timeDensity
              )
            : null}
        </MapMessage>

        {/*
          Map overlay element
          Layer legend for the active layer.
        */}
        {activeChapterLayer?.layer.legend && (
          <SwitchTransition>
            <CSSTransition
              key={activeChapterLayer.layer.name}
              addEndListener={(node, done) => {
                node.addEventListener('transitionend', done, false);
              }}
              classNames='reveal'
            >
              <LayerLegend
                id={`base-${activeChapterLayer.layer.id}`}
                description={activeChapterLayer.layer.description}
                title={activeChapterLayer.layer.name}
                {...activeChapterLayer.layer.legend}
              />
            </CSSTransition>
          </SwitchTransition>
        )}

        <SimpleMap
          className='root'
          mapRef={mapRef}
          containerRef={mapContainer}
          onLoad={() => setMapLoaded(true)}
          mapOptions={mapOptions}
        />
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
