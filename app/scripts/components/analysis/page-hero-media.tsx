import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import mapboxgl from 'mapbox-gl';
import { Feature, MultiPolygon } from 'geojson';
import bbox from '@turf/bbox';

import { SimpleMap } from '$components/common/mapbox/map';

const mapOptions: Partial<mapboxgl.MapboxOptions> = {
  style: process.env.MAPBOX_STYLE_URL,
  logoPosition: 'bottom-left',
  interactive: false
};

interface PageHeroMediaProps {
  feature: Feature<MultiPolygon>;
}

function PageHeroMedia(props: PageHeroMediaProps) {
  const { feature, ...rest } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>(null);
  const [isMapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    const aoiSource = mapRef.current?.getSource('aoi');

    if (!aoiSource) {
      mapRef.current.addSource('aoi', {
        type: 'geojson',
        data: feature
      });

      mapRef.current.addLayer({
        id: 'aoi-stroke',
        type: 'line',
        source: 'aoi',
        paint: { 'line-color': '#f00', 'line-width': 3 }
      });
    }

    mapRef.current.fitBounds(
      bbox(feature) as [number, number, number, number],
      {
        padding: {
          top: 32,
          bottom: 32,
          right: 32,
          left: mapRef.current.getContainer().offsetWidth / 2
      }
      }
    );
  }, [isMapLoaded, feature]);

  return (
    <div {...rest}>
      <SimpleMap
        className='root'
        mapRef={mapRef}
        containerRef={mapContainer}
        onLoad={() => setMapLoaded(true)}
        mapOptions={mapOptions}
      />
    </div>
  );
}

/**
 * Page Hero media map component
 *
 */
export default styled(PageHeroMedia)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;

  > * {
    mix-blend-mode: screen;
    filter: grayscale(100%);

    /* Improve performance */
    transform: translate3d(0, 0, 0);
  }

  &::after {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: ${themeVal('color.primary-500')};
    content: '';
    mix-blend-mode: multiply;
  }
`;
