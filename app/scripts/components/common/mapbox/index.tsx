import React, {
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import styled from 'styled-components';
import { Map as MapboxMap, MapboxOptions } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CompareMbGL from 'mapbox-gl-compare';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
// Avoid error: node_modules/date-fns/esm/index.js does not export 'default'
import * as dateFns from 'date-fns';
import {
  CollecticonCircleXmark,
  CollecticonChevronRightSmall,
  CollecticonChevronLeftSmall,
  iconDataURI
} from '@devseed-ui/collecticons';
import { themeVal } from '@devseed-ui/theme-provider';
import { DatasetDatumFnResolverBag, ProjectionOptions } from 'veda';

import { AoiChangeListenerOverload, AoiState } from '../aoi/types';
import { getLayerComponent, resolveConfigFunctions } from './layers/utils';
import { SimpleMap } from './map';
import MapMessage from './map-message';
import LayerLegendContainer from './layer-legend';
import { useBasemap } from './map-options/use-basemap';
import { DEFAULT_MAP_STYLE_URL } from './map-options/basemaps';
import { Styles } from './layers/styles';
import { Basemap } from './layers/basemap';
import { formatCompareDate, formatSingleDate } from './utils';
import { MapLoading } from '$components/common/loading-skeleton';
import { useDatasetAsyncLayer } from '$context/layer-data';
import {
  ActionStatus,
  S_FAILED,
  S_IDLE,
  S_LOADING,
  S_SUCCEEDED
} from '$utils/status';
import { calcFeatCollArea } from '$components/common/aoi/utils';

const chevronRightURI = () =>
  iconDataURI(CollecticonChevronRightSmall, {
    color: 'white'
  });

const chevronLeftURI = () =>
  iconDataURI(CollecticonChevronLeftSmall, {
    color: 'white'
  });

const MapsContainer = styled.div`
  position: relative;

  .mapboxgl-compare .compare-swiper-vertical {
    background: ${themeVal('color.primary')};
    display: flex;
    align-items: center;
    justify-content: center;

    &::before,
    &::after {
      display: inline-block;
      content: '';
      background-repeat: no-repeat;
      background-size: 1rem 1rem;
      width: 1rem;
      height: 1rem;
    }

    &::before {
      background-image: url('${chevronLeftURI()}');
    }
    &::after {
      background-image: url('${chevronRightURI()}');
    }
  }
`;

const mapOptions: Partial<MapboxOptions> = {
  style: DEFAULT_MAP_STYLE_URL,
  logoPosition: 'bottom-left',
  trackResize: true,
  pitchWithRotate: false,
  dragRotate: false,
  zoom: 1
};

const getMapPositionOptions = (position) => {
  const opts = {} as Pick<typeof mapOptions, 'center' | 'zoom'>;
  if (position?.lng !== undefined && position?.lat !== undefined) {
    opts.center = [position.lng, position.lat];
  }

  if (position?.zoom) {
    opts.zoom = position.zoom;
  }

  return opts;
};

function MapboxMapComponent(props: MapboxMapProps, ref) {
  /* eslint-disable react/prop-types */
  const {
    className,
    id,
    as,
    datasetId,
    layerId,
    date,
    compareDate,
    compareLabel,
    isComparing,
    cooperativeGestures,
    onPositionChange,
    initialPosition,
    withGeocoder,
    aoi,
    onAoiChange,
    projection,
    onProjectionChange
  } = props;
  /* eslint-enable react/prop-types */

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);

  const mapCompareContainer = useRef<HTMLDivElement>(null);
  const mapCompareRef = useRef<MapboxMap>(null);

  const [isMapLoaded, setMapLoaded] = useState(false);
  const [isMapCompareLoaded, setMapCompareLoaded] = useState(false);

  const {
    basemapStyleId,
    onBasemapStyleIdChange,
    labelsOption,
    boundariesOption,
    onOptionChange
  } = useBasemap();

  // This baseLayerStatus is for BaseLayerComponent
  // ex. RasterTimeSeries uses this variable to track the status of
  // registering mosaic.
  const [baseLayerStatus, setBaseLayerStatus] = useState<ActionStatus>(S_IDLE);

  const onBaseLayerStatusChange = useCallback(
    ({ status }) => setBaseLayerStatus(status),
    []
  );
  const [compareLayerStatus, setCompareLayerStatus] =
    useState<ActionStatus>(S_IDLE);
  const onCompareLayerStatusChange = useCallback(
    (status) => setCompareLayerStatus(status),
    []
  );

  // Add ref control operations to allow map to be controlled by the parent.
  useImperativeHandle(ref, () => ({
    resize: () => {
      mapRef.current?.resize();
      mapCompareRef.current?.resize();
    },
    instance: mapRef.current,
    compareInstance: mapCompareRef.current
  }));

  const { baseLayer, compareLayer } = useDatasetAsyncLayer(datasetId, layerId);

  const shouldRenderCompare = isMapLoaded && isComparing;

  // Compare control
  useEffect(() => {
    if (!isMapLoaded || !isComparing || !isMapCompareLoaded) return;

    const compareControl = new CompareMbGL(
      mapRef.current,
      mapCompareRef.current,
      `#${id ?? 'mapbox-container'}`,
      {
        mousemove: false,
        orientation: 'vertical'
      }
    );

    return () => {
      compareControl.remove();
    };
  }, [id, isComparing, isMapCompareLoaded, isMapLoaded]);

  // Some properties defined in the dataset layer config may be functions that
  // need to be resolved before rendering them. These functions accept data to
  // return the correct value.
  const resolverBag = useMemo<DatasetDatumFnResolverBag>(
    () => ({ datetime: date, compareDatetime: compareDate, dateFns }),
    [date, compareDate]
  );

  // Resolve data needed for the base layer once the layer is loaded
  const [baseLayerResolvedData, BaseLayerComponent] = useMemo(() => {
    if (baseLayer?.status !== S_SUCCEEDED || !baseLayer.data)
      return [null, null];

    // Include access to raw data.
    const bag = { ...resolverBag, raw: baseLayer.data };
    const data = resolveConfigFunctions(baseLayer.data, bag);

    return [data, getLayerComponent(!!data.timeseries, data.type)];
  }, [baseLayer, resolverBag]);

  // Resolve data needed for the compare layer once it is loaded.
  const [compareLayerResolvedData, CompareLayerComponent] = useMemo(() => {
    if (compareLayer?.status !== S_SUCCEEDED || !compareLayer.data)
      return [null, null];

    // Include access to raw data.
    const bag = { ...resolverBag, raw: compareLayer.data };
    const data = resolveConfigFunctions(compareLayer.data, bag);

    return [data, getLayerComponent(!!data.timeseries, data.type)];
  }, [compareLayer, resolverBag]);

  // Get the compare to date.
  // The compare date is specified by the user.
  // If no date is specified anywhere we just use the same.
  const compareToDate = useMemo(() => {
    const theDate = compareDate ?? date;
    return theDate instanceof Date && !isNaN(theDate.getTime())
      ? theDate
      : null;
  }, [compareDate, date]);

  const baseTimeDensity = baseLayerResolvedData?.timeseries.timeDensity;
  const compareTimeDensity = compareLayerResolvedData?.timeseries.timeDensity;

  const computedCompareLabel = useMemo(() => {
    // Use a provided label if it exist.
    const providedLabel = compareLabel ?? compareLayerResolvedData?.mapLabel;
    if (providedLabel) return providedLabel as string;

    // Default to date comparison.
    return date && compareToDate
      ? formatCompareDate(
          date,
          compareToDate,
          baseTimeDensity,
          compareTimeDensity
        )
      : null;
  }, [
    compareLabel,
    compareLayerResolvedData?.mapLabel,
    date,
    compareToDate,
    baseTimeDensity,
    compareTimeDensity
  ]);

  return (
    <>
      {/*
        Normally we only need 1 loading which is centered. If we're comparing we
        need to render a loading for each layer, but instead of centering them,
        we show them on top of their respective map.
      */}
      {baseLayerStatus === S_LOADING && (
        <MapLoading position={shouldRenderCompare ? 'left' : 'center'} />
      )}
      {shouldRenderCompare && compareLayerStatus === S_LOADING && (
        <MapLoading position='right' />
      )}

      {/*
        Normally we only need 1 error which is centered. If we're comparing we
        need to render an error for each layer, but instead of centering them,
        we show them on top of their respective map.
      */}
      <MapMessage
        id='mosaic-base-fail-message'
        active={baseLayerStatus === S_FAILED}
        position={shouldRenderCompare ? 'left' : 'center'}
        isInvalid
      >
        <CollecticonCircleXmark /> Failed to load layer {baseLayer?.data?.id}
      </MapMessage>
      <MapMessage
        id='mosaic-compare-fail-message'
        active={compareLayerStatus === S_FAILED}
        position='right'
        isInvalid
      >
        <CollecticonCircleXmark /> Failed to load compare layer{' '}
        {compareLayer?.data?.id}
      </MapMessage>

      {/*
        Map overlay element
        Message shown when the map is is not in compare mode. It displays the
        date being visualized if there is one.
      */}
      <MapMessage
        id='single-map-message'
        active={
          !!(
            !shouldRenderCompare &&
            date &&
            baseLayerResolvedData &&
            baseLayerStatus !== S_FAILED
          )
        }
      >
        {date &&
          formatSingleDate(date, baseLayerResolvedData?.timeseries.timeDensity)}
      </MapMessage>

      {/*
        Map overlay element
        Message shown when the map is in compare mode to indicate what's
        being compared.
        If the user provided an override value (compareLabel), use that.
      */}
      <MapMessage
        id='compare-message'
        active={
          !!(
            shouldRenderCompare &&
            compareLayerResolvedData &&
            compareLayerStatus !== S_FAILED
          )
        }
      >
        {computedCompareLabel}
      </MapMessage>

      {/*
        Map overlay element
        Message shown when the aoi is being used. The message shown depends on
        what is being done to the AOI.
        - No area defined
        - Drawing area shape
        - XXkm2
      */}
      <MapMessage id='aoi-status' active={!!aoi}>
        <p>
          {aoi?.drawing ? (
            'Drawing area shape'
          ) : !aoi?.featureCollection?.features.length ? (
            'No area defined'
          ) : (
            <>
              {calcFeatCollArea(aoi.featureCollection)} km<sup>2</sup> area
            </>
          )}
        </p>
      </MapMessage>

      {/*
        Map overlay element
        Layer legend for the active layer.
      */}
      {baseLayerResolvedData?.legend && (
        <LayerLegendContainer
          layers={[{
            id: `base-${baseLayerResolvedData.id}`,
            title: baseLayerResolvedData.name,
            description: baseLayerResolvedData.description,
            ...baseLayerResolvedData.legend },
            ...compareLayerResolvedData?.legend?[{
              id:`compare-${compareLayerResolvedData.id}`,
              title:compareLayerResolvedData.name,
              description:compareLayerResolvedData.description,
              ...compareLayerResolvedData.legend
            }]: []
          ]}
        />)}
      



      {/*
        Maps container
      */}
      <MapsContainer
        as={as}
        className={className}
        id={id ?? 'mapbox-container'}
      >
        <Styles>
          {/*
        Each layer type is added to the map through a component. This component
        has all the logic needed to add/update/remove the layer.
        Which component to use will depend on the characteristics of the layer
        and dataset.
        The function getLayerComponent() should be used to get the correct
        component.
      */}
          <Basemap
            basemapStyleId={basemapStyleId}
            labelsOption={labelsOption}
            boundariesOption={boundariesOption}
          />
          {isMapLoaded && baseLayerResolvedData && BaseLayerComponent && (
            <BaseLayerComponent
              id={`base-${baseLayerResolvedData.id}`}
              stacCol={baseLayerResolvedData.stacCol}
              mapInstance={mapRef.current}
              date={date}
              sourceParams={baseLayerResolvedData.sourceParams}
              zoomExtent={baseLayerResolvedData.zoomExtent}
              onStatusChange={onBaseLayerStatusChange}
            />
          )}
          <SimpleMap
            className='root'
            mapRef={mapRef}
            containerRef={mapContainer}
            onLoad={() => setMapLoaded(true)}
            onMoveEnd={onPositionChange}
            mapOptions={{
              ...mapOptions,
              ...getMapPositionOptions(initialPosition),
              cooperativeGestures
            }}
            withGeocoder={withGeocoder}
            aoi={aoi}
            onAoiChange={onAoiChange}
            projection={projection}
            onProjectionChange={onProjectionChange}
            basemapStyleId={basemapStyleId}
            onBasemapStyleIdChange={onBasemapStyleIdChange}
            labelsOption={labelsOption}
            boundariesOption={boundariesOption}
            onOptionChange={onOptionChange}
          />
        </Styles>

        {shouldRenderCompare && (
          <Styles>
            {/*
        Adding a layer to the comparison map is also done through a component,
        which is this case targets a different map instance.
      */}
            <Basemap
              basemapStyleId={basemapStyleId}
              labelsOption={labelsOption}
              boundariesOption={boundariesOption}
            />
            {isMapCompareLoaded &&
              compareLayerResolvedData &&
              CompareLayerComponent && (
                <CompareLayerComponent
                  id={`compare-${compareLayerResolvedData.id}`}
                  stacCol={compareLayerResolvedData.stacCol}
                  mapInstance={mapCompareRef.current}
                  date={compareToDate}
                  sourceParams={compareLayerResolvedData.sourceParams}
                  zoomExtent={compareLayerResolvedData.zoomExtent}
                  onStatusChange={onCompareLayerStatusChange}
                />
              )}
            <SimpleMap
              mapRef={mapCompareRef}
              containerRef={mapCompareContainer}
              onLoad={() => setMapCompareLoaded(true)}
              onUnmount={() => setMapCompareLoaded(false)}
              mapOptions={{
                ...mapOptions,
                cooperativeGestures,
                center: mapRef.current?.getCenter(),
                zoom: mapRef.current?.getZoom()
              }}
              withGeocoder={withGeocoder}
              aoi={aoi}
              onAoiChange={onAoiChange}
              projection={projection}
              onProjectionChange={onProjectionChange}
            />
          </Styles>
        )}
      </MapsContainer>
    </>
  );
}

interface MapPosition {
  lng: number;
  lat: number;
  zoom: number;
}

export interface MapboxMapProps {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  as?: any;
  className?: string;
  id?: string;
  datasetId?: string;
  layerId?: string;
  date?: Date;
  compareDate?: Date;
  compareLabel?: string;
  isComparing?: boolean;
  cooperativeGestures?: boolean;
  initialPosition?: Partial<MapPosition>;
  onPositionChange?: (
    result: MapPosition & {
      userInitiated: boolean;
    }
  ) => void;
  withGeocoder?: boolean;
  children?: ReactNode;
  aoi?: AoiState;
  onAoiChange?: AoiChangeListenerOverload;
  projection?: ProjectionOptions;
  onProjectionChange?: (projection: ProjectionOptions) => void;
}

export interface MapboxMapRef {
  resize: () => void;
  instance: MapboxMap | null;
  compareInstance: MapboxMap | null;
}

const MapboxMapComponentFwd = forwardRef<MapboxMapRef, MapboxMapProps>(
  MapboxMapComponent
);

/**
 * Mapbox map component
 *
 * @param {string} id Id to apply to the map wrapper.
 *    Defaults to mapbox-container
 * @param {string} className Css class for styling
 */
export default styled(MapboxMapComponentFwd)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;
