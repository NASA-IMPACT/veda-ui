import React, { useEffect, useState } from 'react';
import { MapRef } from 'react-map-gl';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { themeVal } from '@devseed-ui/theme-provider';
import useMaps from '../hooks/use-maps';
import useThemedControl from './hooks/use-themed-control';
import { round } from '$utils/format';
import { CopyField } from '$components/common/copy-field';

const MapCoordsWrapper = styled.div`
  /* Large width so parent will wrap */
  width: 100vw;
  pointer-events: none !important;

  ${Button} {
    pointer-events: auto;
    background: ${themeVal('color.base-400a')};
    font-weight: ${themeVal('type.base.regular')};
    font-size: 0.75rem;
  }

  && ${Button /* sc-selector */}:hover {
    background: ${themeVal('color.base-500')};
  }
`;

const getCoords = (mapInstance?: MapRef) => {
  if (!mapInstance) return { lng: 0, lat: 0 };
  const mapCenter = mapInstance.getCenter();
  return {
    lng: round(mapCenter.lng, 4),
    lat: round(mapCenter.lat, 4)
  };
};

export default function MapCoordsControl() {
  const { main } = useMaps();

  const [position, setPosition] = useState(getCoords(main));

  useEffect(() => {
    const posListener = (e) => {
      setPosition(getCoords(e.target));
    };

    if (main) main.on('moveend', posListener);

    return () => {
      if (main) main.off('moveend', posListener);
    };
  }, [main]);

  const { lng, lat } = position;
  const value = `W ${lng}, N ${lat}`;

  useThemedControl(
    () => (
      <MapCoordsWrapper>
        <CopyField value={value}>
          {({ ref, showCopiedMsg }) => (
            <Button
              ref={ref}
              // @ts-expect-error achromic-text exists but ui-library types are
              // not up to date
              variation='achromic-text'
              size='small'
            >
              {showCopiedMsg ? 'Copied!' : value}
            </Button>
          )}
        </CopyField>
      </MapCoordsWrapper>
    ),
    { position: 'bottom-left' }
  );

  return null;
}
