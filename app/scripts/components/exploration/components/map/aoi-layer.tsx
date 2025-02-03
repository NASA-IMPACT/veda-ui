import bbox from '@turf/bbox';
import React, { useEffect } from 'react';
import { Layer as MapGLLayer, Source as MapGLSource } from 'react-map-gl';
import type { LngLatBoundsLike } from 'react-map-gl';
import { Feature } from 'geojson';
import { LineLayerSpecification } from 'mapbox-gl';
import useMaps from '$components/common/map/hooks/use-maps';

interface AoiLayerProps {
  aoi: Feature;
}

const AoiLayer = ({ aoi }: AoiLayerProps) => {
  const { main: mapboxMap } = useMaps();

  useEffect(() => {
    if (mapboxMap && aoi) {
      // Fit AOI
      const bounds = bbox(aoi) as LngLatBoundsLike;
      mapboxMap.fitBounds(bounds, {
        padding: 60
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aoi]); // only run on aoi change

  return (
    // This is a GeoJSON source and Layer to display the AOI
    <MapGLSource id='aoi' key='aoi' type='geojson' data={aoi}>
      <MapGLLayer
        {...({
          id: 'aoi-layer',
          source: 'aoi', // References the GeoJSON source defined above
          // // and does not require a `source-layer`
          // 'source-layer': 'aoi',
          type: 'line',
          paint: {
            'line-color': '#008888',
            'line-width': 5
          }
        } as LineLayerSpecification)}
      />
    </MapGLSource>
  );
};

export default AoiLayer;
