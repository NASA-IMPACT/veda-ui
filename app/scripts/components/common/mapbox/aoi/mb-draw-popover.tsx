import React, { MutableRefObject, useMemo } from 'react';
import styled from 'styled-components';
import centroid from '@turf/centroid';
import { CollecticonTrashBin } from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';

import ReactPopoverGl from '../mb-popover';
import { AoiChangeListener, AoiState } from '$components/common/aoi/types';
import { makeFeatureCollection } from '$components/common/aoi/utils';

const ActionPopoverInner = styled.div`
  padding: 0.25rem;
`;

interface MbDrawPopoverProps {
  mapRef: MutableRefObject<mapboxgl.Map | null>;
  onChange?: AoiChangeListener;
  selectedContext: AoiState['selectedContext'];
}

function getCenterCoords(selectedContext) {
  if (!selectedContext) return null;

  const items = selectedContext.points.length
    ? selectedContext.points
    : selectedContext.features;

  const centerPoint = centroid(makeFeatureCollection(items));

  return centerPoint.geometry.coordinates as [number, number];
}

export default function MbDrawPopover(props: MbDrawPopoverProps) {
  const { mapRef, onChange, selectedContext } = props;

  const lngLat = useMemo(
    () => getCenterCoords(selectedContext),
    [selectedContext]
  );

  if (!mapRef.current || !onChange) return null;

  return (
    <ReactPopoverGl
      mbMap={mapRef.current}
      lngLat={lngLat}
      closeOnClick={false}
      renderContents={() => {
        return (
          <ActionPopoverInner>
            <Button
              variation='base-text'
              onClick={() => onChange('aoi.trash-click')}
              fitting='skinny'
            >
              <CollecticonTrashBin />
            </Button>
          </ActionPopoverInner>
        );
      }}
    />
  );
}
