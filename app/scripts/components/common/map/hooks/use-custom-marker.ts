import { useEffect } from 'react';

import markerSdfUrl from '../style/marker-sdf.png';

const CUSTOM_MARKER_ID = 'marker-sdf';

const markerLayout = {
  'icon-image': CUSTOM_MARKER_ID,
  'icon-size': 0.25,
  'icon-anchor': 'bottom'
};

export default function useCustomMarker(mapInstance) {
  useEffect(() => {
    if (!mapInstance) return;
    mapInstance.loadImage(markerSdfUrl, (error, image) => {
      if (error) throw error;
      if (!image) return;
      if (mapInstance.hasImage(CUSTOM_MARKER_ID)) {
        mapInstance.removeImage(CUSTOM_MARKER_ID);
      }
      // add image to the active style and make it SDF-enabled
      mapInstance.addImage(CUSTOM_MARKER_ID, image, { sdf: true });
    });
  }, [mapInstance]);

  return markerLayout;
}
