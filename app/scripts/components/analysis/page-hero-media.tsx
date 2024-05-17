import React, { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { GeoJSONSource, MapboxOptions, Map as MapboxMap } from 'mapbox-gl';
import { FeatureCollection, Polygon } from 'geojson';
import bbox from '@turf/bbox';
import { shade } from 'polished';
import { rgba, themeVal } from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';

import { combineFeatureCollection } from './utils';

import { SimpleMap } from '$components/common/mapbox/map';
import { useEffectPrevious } from '$utils/use-effect-previous';
import { HEADER_TRANSITION_DURATION } from '$utils/use-sliding-sticky-header';
import { DEFAULT_MAP_STYLE_URL } from '$components/common/mapbox/map-options/basemaps';

const WORLD_POLYGON = [
  [180, 90],
  [-180, 90],
  [-180, -90],
  [180, -90],
  [180, 90]
];

const mapOptions: Partial<MapboxOptions> = {
  style: DEFAULT_MAP_STYLE_URL,
  logoPosition: 'bottom-right',
  interactive: false,
  center: [0, 0],
  zoom: 3
};

interface PageHeroMediaProps {
  aoi: FeatureCollection<Polygon>;
  isHeaderStuck: boolean;
}

function PageHeroMedia(props: PageHeroMediaProps) {
  const { aoi, isHeaderStuck, ...rest } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap>(null);
  const [isMapLoaded, setMapLoaded] = useState(false);

  const theme = useTheme();

  // Delay the mount of the hero media to avoid the map showing with the wrong
  // size. See: https://github.com/NASA-IMPACT/veda-ui/issues/330
  // The issue:
  // If on the analysis define page we press the generate button when the header
  // is stuck (this happens if we scrolled down the page) then the analysis
  // results page will be loaded with the header also stuck. This causes the map
  // to mount and read the parent height when it is contracted. The header will
  // then expand but the map will not.
  // The solution:
  // If the header starts as stuck we delay the mounting of the map so by the
  // time the map mounts, the parent already has its final size. In the case
  // that the header is already unstuck when the page loads, this is not needed.
  const [shouldMount, setShouldMount] = useState(!isHeaderStuck);
  useEffectPrevious(
    ([wasStuck]) => {
      if (!shouldMount && wasStuck && !isHeaderStuck) {
        const tid = setTimeout(
          () => setShouldMount(true),
          HEADER_TRANSITION_DURATION
        );

        return () => {
          clearTimeout(tid);
        };
      }
    },
    [isHeaderStuck, shouldMount]
  );

  useEffect(() => {
    if (!shouldMount || !isMapLoaded || !mapRef.current) return;

    const aoiSource = mapRef.current.getSource('aoi') as
      | GeoJSONSource
      | undefined;

    // Convert to multipolygon to use the inverse shading trick.
    const aoiInverse = combineFeatureCollection(aoi);
    // Add a full polygon to reverse the feature.
    aoiInverse.geometry.coordinates[0] = [
      WORLD_POLYGON,
      ...aoiInverse.geometry.coordinates[0]
    ];

    // Contrary to mapbox types getSource can return null.
    if (!aoiSource) {
      mapRef.current.addSource('aoi-inverse', {
        type: 'geojson',
        data: aoiInverse
      });

      mapRef.current.addLayer({
        id: 'aoi-fill',
        type: 'fill',
        source: 'aoi-inverse',
        paint: {
          'fill-color': shade(0.8, theme.color!.primary!),
          'fill-opacity': 0.8
        }
      });
      mapRef.current.addSource('aoi', {
        type: 'geojson',
        data: aoi
      });

      mapRef.current.addLayer({
        id: 'aoi-stroke',
        type: 'line',
        source: 'aoi',
        paint: { 'line-color': '#fff', 'line-width': 1 },
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      });
    } else {
      const aoiSource = mapRef.current.getSource('aoi') as GeoJSONSource;
      const aoiInverseSource = mapRef.current.getSource(
        'aoi-inverse'
      ) as GeoJSONSource;
      aoiSource.setData(aoi);
      aoiInverseSource.setData(aoiInverse);
    }

    mapRef.current.fitBounds(bbox(aoi) as [number, number, number, number], {
      padding: {
        top: 32,
        bottom: 32,
        right: 32,
        left: 12 * 16 // 12rems
      }
    });
    /*
     theme.color.primary will never change. Having it being set once is enough
    */
  }, [shouldMount, isMapLoaded, aoi]);

  return shouldMount ? (
    <div {...rest}>
      <SimpleMap
        className='root'
        mapRef={mapRef}
        containerRef={mapContainer}
        onLoad={() => setMapLoaded(true)}
        mapOptions={mapOptions}
        attributionPosition='top-left'
      />
    </div>
  ) : null;
}

const rgbaFixed = rgba as any;

/**
 * Page Hero media map component
 *
 */
export default styled(PageHeroMedia)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 64%;
  z-index: -1;
  pointer-events: none;
  animation: ${reveal} 2s ease 0s 1;

  &::after {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 32%;
    z-index: 1;
    background: linear-gradient(
      90deg,
      ${rgbaFixed(themeVal('color.primary-900'), 1)} 0%,
      ${rgbaFixed(themeVal('color.primary-900'), 0)} 100%
    );
    content: '';
  }

  &::before {
    position: absolute;
    top: 0;
    right: 100%;
    bottom: 0;
    width: 100vw;
    z-index: 1;
    background: ${themeVal('color.primary-900')};
    content: '';
    pointer-events: none;
  }

  .mapboxgl-ctrl-attrib {
    opacity: 0;
  }
`;
