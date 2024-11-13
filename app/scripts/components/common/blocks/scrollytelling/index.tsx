import React, {
  Children,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
// Avoid error: node_modules/date-fns/esm/index.js does not export 'default'
import scrollama from 'scrollama';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { CollecticonCircleXmark } from '@devseed-ui/collecticons';

import { MapRef } from 'react-map-gl';
import { datasets, ProjectionOptions } from 'veda';
import { BlockErrorBoundary } from '..';
import {
  chapterDisplayName,
  ChapterProps,
  ScrollyChapter,
  validateChapter
} from './chapter';
import { projectionDefault } from '$components/common/map/controls/map-options/projections';
import { userTzDate2utcString, utcString2userTzDate } from '$utils/date';
import { S_FAILED, S_SUCCEEDED } from '$utils/status';

import Hug from '$styles/hug';
import MapMessage from '$components/common/map/map-message';
import { HintedError } from '$utils/hinted-error';
import { useSlidingStickyHeaderProps } from '$components/common/layout-root/useSlidingStickyHeaderProps';
import { HEADER_TRANSITION_DURATION } from '$utils/use-sliding-sticky-header';
import { Basemap } from '$components/common/map/style-generators/basemap';
import Map from '$components/common/map';
import {
  LayerLegend,
  LayerLegendContainer
} from '$components/common/map/layer-legend';
import { Layer } from '$components/exploration/components/map/layer';
import { MapLoading } from '$components/common/loading-skeleton';
import {
  DatasetData,
  DatasetStatus,
  VizDataset,
  VizDatasetSuccess
} from '$components/exploration/types.d.ts';
import { useReconcileWithStacMetadata } from '$components/exploration/hooks/use-stac-metadata-datasets';
import {
  formatSingleDate,
  reconcileVizDataset
} from '$components/common/map/utils';
import { VedauiConfigContext } from '$context/config-context';

type ResolvedScrollyMapLayer = {
  vizDataset: VizDatasetSuccess;
  runtimeData: { datetime?: Date; id: string };
} | null;

export const SCROLLY_MAP_HEIGHT = 'calc(100vh - 3rem)';

const ScrollyMapContainer = styled.div<{ topOffset: number }>`
  height: ${SCROLLY_MAP_HEIGHT};
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
 * @param {array} chList List of chapters with related layers.
 */
function useMapLayersFromChapters(
  chList: ScrollyChapter[],
  envApiStacEndpoint: string
): [ResolvedScrollyMapLayer[], string[]] {
  // The layers are unique based on the dataset, layer id and datetime.
  // First we filter out any scrollytelling block that doesn't have layer.
  const uniqueChapterLayers = useMemo(() => {
    const unique = chList
      .filter(({ showBaseMap }) => !showBaseMap)
      .reduce<Record<string, ScrollyChapter>>((acc, ch) => {
        const key = getChapterLayerKey(ch);
        acc[key] = ch;
        return acc;
      }, {});

    return Object.values(unique);
  }, [chList]);

  // Create an array of datasetId & layerId pairs which we can easily validate when creating
  // the layers array.
  const uniqueLayerRefs = useMemo(() => {
    return uniqueChapterLayers.map(({ datasetId, layerId }) => ({
      datasetId,
      layerId
    }));
  }, [uniqueChapterLayers]);

  // Validate that all layers are defined in the configuration.
  // They must be defined in the configuration otherwise it is not possible to load them.
  const reconciledVizDatasets = uniqueLayerRefs.map(
    ({ datasetId, layerId }) => {
      const layers = datasets[datasetId]?.data.layers;

      const layer = layers?.find((l) => l.id === layerId) as DatasetData | null;

      if (!layer) {
        throw new Error(
          `Layer [${layerId}] not found in dataset [${datasetId}]`
        );
      }

      return reconcileVizDataset(layer);
    }
  );

  const [resolvedDatasetsWithStac, setResolvedDatasetsWithStac] = useState<
    VizDataset[]
  >([]);

  useReconcileWithStacMetadata(
    reconciledVizDatasets,
    setResolvedDatasetsWithStac,
    envApiStacEndpoint
  );

  // Each resolved layer will be an object with:
  // layer: The resolved layerData
  // runtimeData: The runtime data for the layer
  //
  // The difference between runtimeData and layer is that the layer has the
  // layer definition data, the runtimeData belongs to the application and not
  // the layer. For example the datetime, results from a user action (picking
  // on the calendar or in this case setting it in the MDX).
  const resolvedLayers = useMemo(() => {
    return resolvedDatasetsWithStac.map((layer, index) => {
      if (layer.status !== DatasetStatus.SUCCESS) return null;

      const datetime = uniqueChapterLayers[index].datetime;

      return {
        vizDataset: layer,
        runtimeData: {
          datetime,
          id: getChapterLayerKey(uniqueChapterLayers[index])
        }
      };
    });
  }, [resolvedDatasetsWithStac, uniqueChapterLayers]);

  const resolvedStatus = useMemo(
    () => resolvedDatasetsWithStac.map(({ status }) => status),
    [resolvedDatasetsWithStac]
  );

  return [resolvedLayers, resolvedStatus];
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

const MAP_OPTIONS = {
  interactive: false,
  trackResize: true,
  center: [0, 0] as [number, number],
  zoom: 1
};

function Scrollytelling(props) {
  const { children } = props;

  const config = useContext(VedauiConfigContext);

  const { isHeaderHidden, headerHeight, wrapperHeight } =
    useSlidingStickyHeaderProps();

  const mapRef = useRef<MapRef | null>(null);
  const [isMapLoaded, setMapLoaded] = useState(false);

  // Extract the props from the chapters.
  const chapterProps = useChapterPropsFromChildren(children);

  const [resolvedLayers, resolvedStatus] = useMapLayersFromChapters(
    chapterProps,
    config.envApiStacEndpoint
  );

  const [activeChapter, setActiveChapter] = useState<ScrollyChapter | null>(
    null
  );
  const [projection, setProjection] =
    useState<ProjectionOptions>(projectionDefault);

  // All layers must be loaded, resolved, and added to the map before we
  // initialize scrollama. This is needed because in a scrollytelling map we
  // need to preload everything so smooth transitions can be applied.
  const [areAllLayersLoaded, onLayerLoadSuccess] = useAllLayersAdded(
    resolvedLayers.length
  );

  useEffect(() => {
    if (!areAllLayersLoaded) return;

    const scroller = scrollama();

    // Setup initial map state which will be the values on the first chapter.
    const initialChapter = chapterProps[0];

    // @NOTE: getMap method is needed to access hidden method
    // https://visgl.github.io/react-map-gl/docs/api-reference/map#getmap
    const currentMapRef = mapRef.current?.getMap();
    currentMapRef?.setZoom(initialChapter.zoom);
    currentMapRef?.setCenter(initialChapter.center);

    setActiveChapter(initialChapter);

    // setup the instance, pass callback functions
    scroller
      .setup({
        step: '[data-step]',
        offset: 0.8
      })
      .onStepEnter((response) => {
        const { index } = response;

        const chapter = chapterProps[index];
        setActiveChapter(chapter);

        currentMapRef?.flyTo({
          center: chapter.center,
          zoom: chapter.zoom
        });

        const currentProjection = chapter.projectionId
          ? {
              id: chapter.projectionId,
              center: chapter.projectionCenter,
              parallels: chapter.projectionParallels
            }
          : undefined;

        currentProjection && setProjection(currentProjection);
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

  const activeChapterLayerData = activeChapterLayer
    ? activeChapterLayer.vizDataset.data
    : null;

  const { description, id, name, legend, timeDensity } =
    activeChapterLayerData ?? {};

  return (
    <>
      <ScrollyMapContainer topOffset={topOffset}>
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
                timeDensity
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
            key={name}
            timeout={!activeChapterLayer ? 1 : undefined}
            addEndListener={(node, done) => {
              if (!activeChapterLayer) return;
              node?.addEventListener('transitionend', done, false);
            }}
            classNames='reveal'
          >
            {legend ? (
              <LayerLegendContainer>
                <LayerLegend
                  id={`base-${id}`}
                  description={description ?? ''}
                  title={name ?? ''}
                  {...legend}
                />
              </LayerLegendContainer>
            ) : (
              <div />
            )}
          </CSSTransition>
        </SwitchTransition>

        <Map
          id='scrollymap-map'
          mapOptions={MAP_OPTIONS}
          mapRef={mapRef}
          onMapLoad={() => {
            setMapLoaded(true);
            mapRef.current?.resize();
          }}
          onStyleUpdate={() => {
            mapRef.current?.resize();
          }}
          projection={projection}
        >
          {isMapLoaded &&
            resolvedLayers.map((resolvedLayer, lIdx) => {
              if (!resolvedLayer || !mapRef.current) return null;

              const { runtimeData, vizDataset } = resolvedLayer;
              const isHidden =
                !activeChapterLayerId ||
                activeChapterLayerId !== runtimeData.id ||
                activeChapter.showBaseMap;

              return (
                <Layer
                  key={runtimeData.id}
                  id={`scrolly-${runtimeData.id}`}
                  dataset={{
                    ...vizDataset,
                    settings: {
                      opacity: 100,
                      isVisible: !isHidden
                    }
                  }}
                  selectedDay={runtimeData.datetime ?? new Date()}
                  order={lIdx}
                  onStatusChange={onLayerLoadSuccess}
                />
              );
            })}
          <Basemap />
        </Map>
      </ScrollyMapContainer>
      <TheChapters>{children}</TheChapters>
    </>
  );
}

Scrollytelling.propTypes = {
  children: T.node
};

export function ScrollytellingBlock(props) {
  return <BlockErrorBoundary {...props} childToRender={Scrollytelling} />;
}
