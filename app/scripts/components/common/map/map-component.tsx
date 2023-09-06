import React, { useCallback, ReactElement, useContext } from 'react';
import ReactMapGlMap from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import { StylesContext } from './styles';
import { MapsContext } from './maps';

export default function MapComponent({
  controls,
  isCompared
}: {
  controls: ReactElement[];
  isCompared?: boolean;
}) {
  const { initialViewState, setInitialViewState, mainId, comparedId } =
    useContext(MapsContext);

  const id = isCompared ? comparedId : mainId;

  const onMove = useCallback(
    (evt) => {
      if (!isCompared) {
        setInitialViewState(evt.viewState);
      }
    },
    [isCompared, setInitialViewState]
  );

  const { style } = useContext(StylesContext);

  if (!style) return null;

  return (
    <ReactMapGlMap
      id={id}
      mapboxAccessToken={process.env.MAPBOX_TOKEN}
      initialViewState={initialViewState}
      mapStyle={style as any}
      onMove={onMove}
    >
      {controls}
    </ReactMapGlMap>
  );
}
