import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Map } from 'mapbox-gl';

import { themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

import { CopyField } from '../copy-field';
import { round } from '$utils/format';

const MapCoordsWrapper = styled.div`
  /* Large width so parent will wrap */
  width: 100vw;

  ${Button} {
    background: ${themeVal('color.base-400a')};
    font-weight: ${themeVal('type.base.regular')};
    font-size: 0.75rem;
  }

  && ${Button /* sc-selector */}:hover {
    background: ${themeVal('color.base-500')};
  }
`;

interface MapCoordsProps {
  mapInstance: Map;
}

const getCoords = (mapInstance: Map) => {
  const mapCenter = mapInstance.getCenter();
  return {
    lng: round(mapCenter.lng, 4),
    lat: round(mapCenter.lat, 4)
  };
};

export default function MapCoords(props: MapCoordsProps) {
  const { mapInstance } = props;

  const [position, setPosition] = useState(getCoords(mapInstance));

  useEffect(() => {
    const posListener = (e) => {
      setPosition(getCoords(e.target));
    };

    mapInstance.on('moveend', posListener);

    return () => {
      mapInstance.off('moveend', posListener);
    };
  }, [mapInstance]);

  const { lng, lat } = position;
  const value = `W ${lng}, N ${lat}`;

  return (
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
  );
}
