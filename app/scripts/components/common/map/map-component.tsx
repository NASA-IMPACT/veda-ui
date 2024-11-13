import React, {
  useCallback,
  ReactElement,
  useMemo,
  Ref,
  useContext
} from 'react';
import ReactMapGlMap, { LngLatBoundsLike, MapRef } from 'react-map-gl';
import { debounce } from 'lodash';
import useMapStyle from './hooks/use-map-style';
import { useMapsContext } from './hooks/use-maps';
import { convertProjectionToMapbox } from './controls/map-options/projections';
import { ProjectionOptions } from '$types/veda';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import { VedauiConfigContext } from '$context/config-context';

const maxMapBounds: LngLatBoundsLike = [
  [-540, -90], // SW
  [540, 90] // NE
];

export default function MapComponent({
  controls,
  isCompared,
  projection,
  mapRef,
  onMapLoad,
  interactive = true
}: {
  controls: ReactElement[];
  isCompared?: boolean;
  projection?: ProjectionOptions;
  mapRef?: Ref<MapRef>;
  onMapLoad?: () => void;
  interactive?: boolean;
}) {
  const config = useContext(VedauiConfigContext);

  const { initialViewState, setInitialViewState, mainId, comparedId } =
    useMapsContext();
  const { style } = useMapStyle();

  const id = isCompared ? comparedId : mainId;

  const debouncedSetInitialViewState = useCallback(
    debounce((viewState) => {
      setInitialViewState(viewState);
    }, 100),
    [setInitialViewState]
  );

  const onMove = useCallback(
    (evt) => {
      if (
        !isCompared &&
        (evt.viewState.longitude !== initialViewState.longitude ||
          evt.viewState.latitude !== initialViewState.latitude)
      ) {
        debouncedSetInitialViewState(evt.viewState);
      }
    },
    [
      isCompared,
      debouncedSetInitialViewState,
      initialViewState.longitude,
      initialViewState.latitude
    ]
  );

  // Get MGL projection from Veda projection
  const mapboxProjection = useMemo(() => {
    if (!projection) return undefined;
    return convertProjectionToMapbox(projection);
  }, [projection]);

  return (
    <ReactMapGlMap
      id={id}
      ref={mapRef}
      mapboxAccessToken={config.mapboxToken}
      dragRotate={false}
      touchPitch={false}
      pitchWithRotate={false}
      maxPitch={0}
      initialViewState={initialViewState}
      mapStyle={style as any}
      onMove={onMove}
      onLoad={onMapLoad}
      projection={mapboxProjection}
      maxBounds={maxMapBounds}
      interactive={interactive}
    >
      {controls}
    </ReactMapGlMap>
  );
}
