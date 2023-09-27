import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import styled from 'styled-components';
import { FeatureCollection, Polygon } from 'geojson';
import bbox from '@turf/bbox';

import { themeVal } from '@devseed-ui/theme-provider';

import {
  Toolbar,
  ToolbarIconButton,
  VerticalDivider
} from '@devseed-ui/toolbar';
import { Button, ButtonGroup } from '@devseed-ui/button';
import { Dropdown, DropMenu, DropTitle } from '@devseed-ui/dropdown';
import {
  CollecticonTrashBin,
  CollecticonHandPan,
  CollecticonMarker,
  CollecticonPencil,
  CollecticonUpload2
} from '@devseed-ui/collecticons';
import { FeatureByRegionPreset, RegionPreset } from '../constants';
import AoIUploadModal from './aoi-upload-modal';
import { FoldWGuideLine, FoldTitleWOAccent } from '.';
import {
  FoldHeader,
  FoldHeadline,
  FoldHeadActions,
  FoldBody
} from '$components/common/fold';
import MapboxMap, { MapboxMapRef } from '$components/common/mapbox';
import {
  AoiChangeListenerOverload,
  AoiState
} from '$components/common/aoi/types';
import DropMenuItemButton from '$styles/drop-menu-item-button';
import { makeFeatureCollection } from '$components/common/aoi/utils';
import { variableGlsp } from '$styles/variable-utils';

const MapContainer = styled.div`
  position: relative;
  border-radius: ${themeVal('shape.rounded')};
  overflow: hidden;
`;

const AoiMap = styled(MapboxMap)`
  min-height: 24rem;
`;

const AoiHeadActions = styled(FoldHeadActions)`
  z-index: 1;
  /* 2 times vertical glsp to account for paddings + 2rem which is the height of
  the buttons */
  transform: translate(${variableGlsp(-1)}, calc(${variableGlsp(2)} + 2rem));
`;

interface AoiSelectorProps {
  mapRef: RefObject<MapboxMapRef>;
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
  const { drawing, featureCollection } = aoiDrawState;

  // For the drawing tool, the features need an id.
  const qsFc: FeatureCollection<Polygon> | null = useMemo(() => {
    return qsAoi
      ? makeFeatureCollection(
          qsAoi.features.map((f, i) => ({ id: `qs-feature-${i}`, ...f }))
        )
      : null;
  }, [qsAoi]);

  const setFeatureCollection = useCallback(
    (featureCollection: FeatureCollection<Polygon>) => {
      onAoiEvent('aoi.set', { featureCollection });
      const fcBbox = bbox(featureCollection) as [
        number,
        number,
        number,
        number
      ];
      mapRef.current?.instance?.fitBounds(fcBbox, { padding: 32 });
    },
    [onAoiEvent]
  );

  const onRegionPresetClick = useCallback(
    (preset: RegionPreset) => {
      setFeatureCollection(FeatureByRegionPreset[preset]);
    },
    [setFeatureCollection]
  );

  // Use the feature from the url qs or the region preset as the initial state
  // to center the map.
  useEffect(() => {
    if (qsFc) {
      setFeatureCollection(qsFc);
    } else {
      onAoiEvent('aoi.clear');
      mapRef.current?.instance?.flyTo({ zoom: 1, center: [0, 0] });
    }
  }, [onAoiEvent, qsFc, setFeatureCollection]);

  const [aoiModalRevealed, setAoIModalRevealed] = useState(false);

  return (
    <FoldWGuideLine number={1}>
      <AoIUploadModal
        setFeatureCollection={setFeatureCollection}
        revealed={aoiModalRevealed}
        onCloseClick={() => setAoIModalRevealed(false)}
      />
      <FoldHeader>
        <FoldHeadline>
          <FoldTitleWOAccent>Select area of interest</FoldTitleWOAccent>
          <p>
            Use the pencil tool to draw a shape on the map or upload your own
            shapefile.
          </p>
        </FoldHeadline>
        <AoiHeadActions>
          <Toolbar>
            <ToolbarIconButton
              variation='danger-fill'
              onClick={() => onAoiEvent('aoi.clear')}
              disabled={!featureCollection?.features.length}
            >
              <CollecticonTrashBin title='Clear map' meaningful />
            </ToolbarIconButton>
            <VerticalDivider variation='dark' />
            <ButtonGroup variation='primary-fill'>
              <Button
                onClick={() => onAoiEvent('aoi.draw-click')}
                active={drawing}
                fitting='skinny'
              >
                <CollecticonPencil title='Drawing mode' meaningful />
              </Button>
              <Button
                onClick={() => onAoiEvent('aoi.select-click')}
                active={!drawing}
                fitting='skinny'
              >
                <CollecticonHandPan title='Selection mode' meaningful />
              </Button>
            </ButtonGroup>
            <ToolbarIconButton
              onClick={() => setAoIModalRevealed(true)}
              variation='primary-fill'
            >
              <CollecticonUpload2 title='Upload geoJSON' meaningful />
            </ToolbarIconButton>
            <Dropdown
              alignment='right'
              triggerElement={(props) => (
                <ToolbarIconButton variation='primary-fill' {...props}>
                  <CollecticonMarker title='More options' meaningful />
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
                <li>
                  <DropMenuItemButton
                    onClick={() => onRegionPresetClick('north-america')}
                  >
                    North America
                  </DropMenuItemButton>
                </li>
              </DropMenu>
            </Dropdown>
          </Toolbar>
        </AoiHeadActions>
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
    </FoldWGuideLine>
  );
}
