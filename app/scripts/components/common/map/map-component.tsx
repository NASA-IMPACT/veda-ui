import React, {
  useCallback,
  ReactElement,
  useContext
} from 'react';
import ReactMapGlMap from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import { StylesContext } from './styles';
import { MapId } from './types';
import { MapWrapperContext } from './map-wrapper';

export default function MapComponent({
  id,
  controls
}: {
  id: MapId;
  controls: ReactElement[];
}) {
  const { initialViewState, setInitialViewState } =
    useContext(MapWrapperContext);

  const onMove = useCallback(
    (evt) => {
      if (id === 'main') {
        setInitialViewState(evt.viewState);
      }
    },
    [id, setInitialViewState]
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
