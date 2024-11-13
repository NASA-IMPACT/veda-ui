import { useCallback } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import { useControl } from 'react-map-gl';
import { getZoomFromBbox } from '$components/common/map/utils';

export default function GeocoderControl({
  mapboxToken
}: {
  mapboxToken: string;
}) {
  const handleGeocoderResult = useCallback(
    (map, geocoder) =>
      ({ result }) => {
        geocoder.clear();
        geocoder._inputEl.blur();
        // Pass arbiturary number for zoom if there is no bbox
        const zoom = result.bbox ? getZoomFromBbox(result.bbox) : 14;
        map.flyTo({
          center: result.center,
          zoom
        });
      },
    []
  );

  useControl(
    ({ map }) => {
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxToken,
        marker: false,
        collapsed: true,
        // Because of Mapbox issue: https://github.com/mapbox/mapbox-gl-js/issues/12565
        // We are doing manual centering for now
        flyTo: false
      });
      geocoder.on('result', handleGeocoderResult(map, geocoder));
      return geocoder;
    },
    {
      position: 'top-right'
    }
  );

  return null;
}
