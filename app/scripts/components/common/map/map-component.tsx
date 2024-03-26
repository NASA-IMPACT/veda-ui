import React, { useCallback, ReactElement, useMemo } from 'react';
import ReactMapGlMap, { LngLatBoundsLike } from 'react-map-gl';
import { ProjectionOptions } from 'veda';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import { convertProjectionToMapbox } from '../mapbox/map-options/utils';
import useMapStyle from './hooks/use-map-style';
import { useMapsContext } from './hooks/use-maps';

const maxMapBounds: LngLatBoundsLike = [
  [-540, -90], // SW
  [540, 90] // NE
];

export default function MapComponent({
  controls,
  isCompared,
  projection,
}: {
  controls: ReactElement[];
  isCompared?: boolean;
  projection?: ProjectionOptions;
}) {
  const { initialViewState, setInitialViewState, mainId, comparedId } =
    useMapsContext();

  const id = isCompared ? comparedId : mainId;

  const onMove = useCallback(
    (evt) => {
      if (!isCompared) {
        setInitialViewState(evt.viewState);
      }
    },
    [isCompared, setInitialViewState]
  );

  // Get MGL projection from Veda projection
  const mapboxProjection = useMemo(() => {
    if (!projection) return undefined;
    return convertProjectionToMapbox(projection);
  }, [projection]);

  const { style } = useMapStyle();

  if (!style) return null;

  return (
    <ReactMapGlMap
      id={id}
      mapboxAccessToken={process.env.MAPBOX_TOKEN}
      dragRotate={false}
      touchPitch={false}
      pitchWithRotate={false}
      maxPitch={0}
      initialViewState={initialViewState}
      mapStyle={style as any}
      onMove={onMove}
      projection={mapboxProjection}
      maxBounds={maxMapBounds}
    >
      {controls}
    </ReactMapGlMap>
  );
}
