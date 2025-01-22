import bbox from '@turf/bbox';
import React, { useEffect } from 'react';
import { Layer as MapGLLayer, Source as MapGLSource } from 'react-map-gl';
import type { LineLayer } from 'react-map-gl';
import { Feature } from 'geojson';
import { getZoomFromBbox } from '$components/common/map/utils';
import useMaps from '$components/common/map/hooks/use-maps';

interface AoiLayerProps {
  aoi: Feature;
}

const AoiLayer = ({ aoi }: AoiLayerProps) => {
  const { main: mapboxMap } = useMaps();

  useEffect(() => {
    if (mapboxMap && aoi) {
      /*
      const bounds = bbox(aoi) as LngLatBoundsLike;
      mapboxMap.fitBounds(bounds, {
        padding: 60
      });
      */

      // Fit AOI
      // The `flyTo` method is used instead of `fitBounds` to ensure compatibility with map projections other than Web Mercator.
      const bboxToFit = bbox(aoi);
      const zoom = bboxToFit ? getZoomFromBbox(bboxToFit) : 14;
      mapboxMap?.flyTo({
        center: [
          (bboxToFit[2] + bboxToFit[0]) / 2, // correcting the map offset by /2
          (bboxToFit[3] + bboxToFit[1]) / 2 // correcting the map offset by /2
        ],
        zoom
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
        } as LineLayer)}
      />
    </MapGLSource>
  );
};

export default AoiLayer;
