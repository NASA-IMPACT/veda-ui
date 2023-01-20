import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FeatureCollection, Polygon } from 'geojson';
import bbox from '@turf/bbox';

import {
  Toolbar,
  ToolbarIconButton,
  ToolbarLabel,
  VerticalDivider
} from '@devseed-ui/toolbar';

import { Dropdown, DropMenu, DropTitle } from '@devseed-ui/dropdown';
import {
  CollecticonArea,
  CollecticonGlobe,
  CollecticonTrashBin,
  CollecticonUpload2
} from '@devseed-ui/collecticons';
import { FeatureByRegionPreset, RegionPreset } from './constants';
import AoIUploadModal from './aoi-upload-modal';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldHeadActions,
  FoldTitle,
  FoldBody
} from '$components/common/fold';
import MapboxMap, { MapboxMapRef } from '$components/common/mapbox';
import {
  AoiChangeListenerOverload,
  AoiState
} from '$components/common/aoi/types';
import DropMenuItemButton from '$styles/drop-menu-item-button';
import { featureCollection } from '$components/common/aoi/utils';

const MapContainer = styled.div`
  position: relative;
`;

const AoiMap = styled(MapboxMap)`
  min-height: 24rem;
`;

interface AoiSelectorProps {
  mapRef: React.RefObject<MapboxMapRef>;
  qsAoi?: FeatureCollection<Polygon>;
  aoiDrawState: AoiState;
  onAoiEvent: AoiChangeListenerOverload;
}

export default function AoiSelector({
  mapRef,
  onAoiEvent,
  qsAoi,
  aoiDrawState
}: AoiSelectorProps) {
  const { selected, drawing, fc } = aoiDrawState;

  // For the drawing tool, the features need an id.
  const qsFc: FeatureCollection<Polygon> | null = useMemo(() => {
    return qsAoi
      ? featureCollection(
          qsAoi.features.map((f, i) => ({ id: `qs-feature-${i}`, ...f }))
        )
      : null;
  }, [qsAoi]);

  const setFC = useCallback(
    (fc: FeatureCollection<Polygon>) => {
      onAoiEvent('aoi.set', { fc });
      const fcBbox = bbox(fc) as [number, number, number, number];
      mapRef.current?.instance?.fitBounds(fcBbox, { padding: 32 });
    },
    [onAoiEvent]
  );

  const onRegionPresetClick = useCallback(
    (preset: RegionPreset) => {
      setFC(FeatureByRegionPreset[preset]);
    },
    [setFC]
  );

  // Use the feature from the url qs or the region preset as the initial state
  // to center the map.
  useEffect(() => {
    if (qsFc) {
      setFC(qsFc);
    } else {
      onAoiEvent('aoi.clear');
      mapRef.current?.instance?.flyTo({ zoom: 1, center: [0, 0] });
    }
  }, [onAoiEvent, qsFc, setFC]);

  const [aoiModalRevealed, setAoIModalRevealed] = useState(false);

  return (
    <Fold>
      <AoIUploadModal
        setFC={setFC}
        revealed={aoiModalRevealed}
        onCloseClick={() => setAoIModalRevealed(false)}
      />
      <FoldHeader>
        <FoldHeadline>
          <FoldTitle>Area</FoldTitle>
        </FoldHeadline>
        <FoldHeadActions>
          <Toolbar size='small'>
            <ToolbarLabel>Actions</ToolbarLabel>
            <ToolbarIconButton
              variation='base-text'
              onClick={() => onAoiEvent('aoi.trash-click')}
              disabled={!fc?.features.length}
            >
              <CollecticonTrashBin title='Delete shape' meaningful />
            </ToolbarIconButton>
            <VerticalDivider variation='dark' />
            <ToolbarIconButton
              variation='base-text'
              onClick={() => onAoiEvent('aoi.draw-click')}
              active={selected || drawing}
            >
              <CollecticonArea title='Draw shape' meaningful />
            </ToolbarIconButton>
            {/* <ToolbarIconButton
              variation='base-text'
              onClick={() => setAoIModalRevealed(true)}
            >
              <CollecticonUpload2 title='Upload geoJSON' meaningful />
            </ToolbarIconButton> */}
            <Dropdown
              alignment='right'
              triggerElement={(props) => (
                <ToolbarIconButton variation='base-text' {...props}>
                  <CollecticonGlobe title='More options' meaningful />
                </ToolbarIconButton>
              )}
            >
              <DropTitle>Select a region (BETA)</DropTitle>
              <DropMenu>
                <li>
                  <DropMenuItemButton
                    onClick={() => onRegionPresetClick('world')}
                  >
                    World
                  </DropMenuItemButton>
                </li>
              </DropMenu>
            </Dropdown>
          </Toolbar>
        </FoldHeadActions>
      </FoldHeader>
      <FoldBody>
        <MapContainer>
          <AoiMap
            ref={mapRef}
            aoi={aoiDrawState}
            onAoiChange={onAoiEvent}
            cooperativeGestures
          />
        </MapContainer>
      </FoldBody>
    </Fold>
  );
}
