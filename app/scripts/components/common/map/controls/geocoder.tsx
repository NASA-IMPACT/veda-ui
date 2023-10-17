import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import { useControl } from 'react-map-gl';

export default function GeocoderControl() {
  useControl(
    () => {
      return new MapboxGeocoder({
        accessToken: process.env.MAPBOX_TOKEN,
        marker: false,
        collapsed: true
      });
    },
    {
      position: 'top-right'
    }
  );

  return null;
}
